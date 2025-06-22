import axios from "axios"
/**
 * @author Phan NT Son
 * @description Tạo thông báo khi người dùng thêm game vào giỏ hàng
 * @param {*} receiverId - ID of the user receiving the notification
 */
export const createNotification = async (receiverId ,type, message) => {
    try {
        const response = await axios.post(
            "http://localhost:8080/notification/create",
            {
                receiverId: receiverId, 
                notificationType: type,
                notificationContent: message,
            }
        );
        console.log("Notification created:", response.data);
    } catch (error) {
        console.error("Error creating notification:", error);
    }
};