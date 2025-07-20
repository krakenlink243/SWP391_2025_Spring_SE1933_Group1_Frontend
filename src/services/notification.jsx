import axios from "axios"

/**
 * @author Phan NT Son
 * @description Tạo thông báo khi người dùng thêm game vào giỏ hàng
 * @param {*} receiverId - ID of the user receiving the notification
 */
export const createNotification = async (receiverId, type, message) => {
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/notification/create`,
            {
                receiverId: receiverId,
                notificationType: type,
                notificationContent: message,
            }
        );
    } catch (error) {
        console.error("Error creating notification:", error);
    }
};
