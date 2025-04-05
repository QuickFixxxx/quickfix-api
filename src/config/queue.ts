import { Queue, Worker } from "bullmq";
import { environmentVar } from "./env";

export const otpQueue = new Queue("otpQueue", {
  connection: {
    host: environmentVar.REDIS_HOST,
    port: parseInt(environmentVar.REDIS_PORT, 10),
    password: environmentVar.REDIS_PASSWORD,
  },
});

export const otpWorker = new Worker(
  "otpQueue",
  async (job) => {
    // send otp to user through sms
    console.log(`Processing OTP job for ${job.data.phoneNumber}`);
    console.log(`OTP ${job.data.otp} sent to ${job.data.phoneNumber}`);
  },
  {
    connection: {
      host: environmentVar.REDIS_HOST,
      port: parseInt(environmentVar.REDIS_PORT, 10),
      password: environmentVar.REDIS_PASSWORD,
    },
  }
);
