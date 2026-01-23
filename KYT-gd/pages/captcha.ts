// src/utils.ts
// 生成4位验证码（去掉容易混淆的字符）
export const generateCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// 提交数据到云函数的通用方法
export const submitToCloud = async (data: {
  name: string;
  phone?: string;
  email: string;
  content: string;
}) => {
  const CLOUD_API_URL = "https://sendemail-whbchtbohi.cn-hongkong.fcapp.run";
  try {
    await fetch(CLOUD_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
  } catch (error) {
    console.error("提交到云函数失败：", error);
  }
};