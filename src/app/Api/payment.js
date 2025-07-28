const API_BASE_URL = "https://backend-ui4w.onrender.com/api/v1";

export const initiatePayment = async (enrollmentId, paymentMethod, walletPhoneNumber = null, token) => {
  try {
    const requestBody = {
      enrollmentId: enrollmentId,
      paymentMethod: paymentMethod
    };

    // إضافة رقم المحفظة إذا تم اختيار المحفظة
    if (paymentMethod === "wallet" && walletPhoneNumber) {
      requestBody.walletPhoneNumber = walletPhoneNumber;
    }

    const response = await fetch(`${API_BASE_URL}/payment/initiate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error initiating payment:", error);
    throw error;
  }
}; 