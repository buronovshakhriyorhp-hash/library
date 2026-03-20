import { prisma } from "../lib/prisma";
import * as crypto from "crypto";
import { AppError } from "../middleware/error.middleware";

export const clickPrepare = async (data: any) => {
  const { click_trans_id, merchant_id, amount, merchant_prepare_id, sign_time, sign_string } = data;

  const expectedSign = crypto
    .createHash("md5")
    .update(`${click_trans_id}${merchant_id}${process.env.CLICK_SECRET_KEY}${merchant_prepare_id}${amount}${sign_time}`)
    .digest("hex");

  if (sign_string !== expectedSign) return { error: -1, error_note: "Noto'g'ri imzo" };

  const orderId = Number(merchant_prepare_id);
  const order = await prisma.order.findUnique({ where: { id: orderId } });

  if (!order) return { error: -5, error_note: "Buyurtma topilmadi" };
  if (order.total !== Math.round(Number(amount))) return { error: -2, error_note: "Noto'g'ri summa" };

  await prisma.paymentLog.upsert({
    where: { transactionId: String(click_trans_id) },
    update: { payload: data },
    create: {
      provider: "click",
      transactionId: String(click_trans_id),
      amount: order.total,
      status: "PENDING",
      orderId,
      payload: data,
    },
  });

  return { click_trans_id, merchant_trans_id: orderId, merchant_prepare_id: orderId, error: 0, error_note: "Success" };
};

export const clickComplete = async (data: any) => {
  const { click_trans_id, merchant_trans_id, merchant_prepare_id, error } = data;
  const orderId = Number(merchant_prepare_id || merchant_trans_id);
  const success = Number(error) === 0;

  await prisma.paymentLog.updateMany({
    where: { transactionId: String(click_trans_id) },
    data: { status: success ? "SUCCESS" : "FAILED", payload: data },
  });

  if (success) {
    await prisma.order.update({
      where: { id: orderId },
      data: { paymentStatus: "SUCCESS", status: "PAID" },
    });
  }

  return { click_trans_id, merchant_trans_id: orderId, error: 0, error_note: "Success" };
};

export const paymeTransaction = async (method: string, params: any, id: number) => {
  const orderId = Number(params?.account?.order_id);

  switch (method) {
    case "CheckPerformTransaction": {
      const order = await prisma.order.findUnique({ where: { id: orderId } });
      if (!order) return { error: { code: -31050, message: { uz: "Buyurtma topilmadi" } }, id };
      if (order.total * 100 !== Number(params.amount)) return { error: { code: -31001, message: { uz: "Noto'g'ri summa" } }, id };
      return { result: { allow: true }, id };
    }
    case "CreateTransaction": {
      const order = await prisma.order.findUnique({ where: { id: orderId } });
      if (!order) return { error: { code: -31050, message: { uz: "Buyurtma topilmadi" } }, id };
      
      await prisma.paymentLog.upsert({
        where: { transactionId: String(params.id) },
        update: {},
        create: {
          provider: "payme",
          transactionId: String(params.id),
          amount: order.total,
          status: "PENDING",
          orderId: order.id,
          payload: params,
        },
      });
      return { result: { create_time: Date.now(), transaction: params.id, state: 1 }, id };
    }
    case "PerformTransaction": {
      await prisma.paymentLog.updateMany({
        where: { transactionId: String(params.id) },
        data: { status: "SUCCESS", payload: params },
      });
      await prisma.order.update({
        where: { id: orderId },
        data: { paymentStatus: "SUCCESS", status: "PAID" },
      });
      return { result: { transaction: params.id, perform_time: Date.now(), state: 2 }, id };
    }
    case "CancelTransaction": {
      await prisma.paymentLog.updateMany({
        where: { transactionId: String(params.id) },
        data: { status: "CANCELLED", payload: params },
      });
      await prisma.order.update({
        where: { id: orderId },
        data: { paymentStatus: "CANCELLED", status: "CANCELLED" },
      });
      return { result: { transaction: params.id, cancel_time: Date.now(), state: -1 }, id };
    }
    case "CheckTransaction": {
      const log = await prisma.paymentLog.findFirst({ where: { transactionId: String(params.id) } });
      if (!log) return { error: { code: -31003, message: { uz: "Tranzaksiya topilmadi" } }, id };
      const stateMap: Record<string, number> = { PENDING: 1, SUCCESS: 2, CANCELLED: -1, FAILED: -2 };
      return { result: { create_time: log.createdAt.getTime(), state: stateMap[log.status] || 0, transaction: log.transactionId }, id };
    }
    default:
      return { error: { code: -32601, message: { uz: "Metod topilmadi" } }, id };
  }
};

export const getPaymentStatus = async (orderId: number) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: { id: true, paymentStatus: true, status: true, total: true, paymentMethod: true },
  });
  if (!order) throw new AppError("Buyurtma topilmadi", 404);
  return order;
};
