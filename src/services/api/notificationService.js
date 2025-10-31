import { getApperClient } from "@/services/apperClient"
import { useSelector } from "react-redux"

export const notificationService = {
  async getAll() {
    try {
      const apperClient = getApperClient()
      const response = await apperClient.fetchRecords('notification_c', {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "message_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "read_c" } },
          { field: { Name: "target_id_c" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "actor_id_c" }, referenceField: { field: { Name: "username_c" } } },
          { field: { Name: "actor_id_c" }, referenceField: { field: { Name: "profile_picture_c" } } },
          { field: { Name: "user_id_c" } }
        ],
        orderBy: [{ fieldName: "CreatedOn", sorttype: "DESC" }]
      })

      if (!response.success) {
        console.error(response.message)
        return []
      }

      return (response.data || []).map(notification => ({
        ...notification,
        actor: notification.actor_id_c ? {
          Id: notification.actor_id_c.Id,
          username_c: notification.actor_id_c.username_c,
          profile_picture_c: notification.actor_id_c.profile_picture_c
        } : null
      }))
    } catch (error) {
      console.error("Error fetching notifications:", error?.response?.data?.message || error)
      return []
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient()
      const response = await apperClient.getRecordById('notification_c', parseInt(id), {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "message_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "read_c" } },
          { field: { Name: "target_id_c" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "actor_id_c" }, referenceField: { field: { Name: "username_c" } } },
          { field: { Name: "actor_id_c" }, referenceField: { field: { Name: "profile_picture_c" } } },
          { field: { Name: "user_id_c" } }
        ]
      })

      if (!response.success) {
        console.error(response.message)
        throw new Error("Notification not found")
      }

      const notification = response.data
      return {
        ...notification,
        actor: notification.actor_id_c ? {
          Id: notification.actor_id_c.Id,
          username_c: notification.actor_id_c.username_c,
          profile_picture_c: notification.actor_id_c.profile_picture_c
        } : null
      }
    } catch (error) {
      console.error(`Error fetching notification ${id}:`, error?.response?.data?.message || error)
      throw new Error("Notification not found")
    }
  },

  async getByUserId(userId) {
    try {
      const apperClient = getApperClient()
      const response = await apperClient.fetchRecords('notification_c', {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "message_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "read_c" } },
          { field: { Name: "target_id_c" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "actor_id_c" }, referenceField: { field: { Name: "username_c" } } },
          { field: { Name: "actor_id_c" }, referenceField: { field: { Name: "profile_picture_c" } } },
          { field: { Name: "user_id_c" } }
        ],
        where: [{ FieldName: "user_id_c", Operator: "EqualTo", Values: [parseInt(userId)] }],
        orderBy: [{ fieldName: "CreatedOn", sorttype: "DESC" }]
      })

      if (!response.success) {
        console.error(response.message)
        return []
      }

      return (response.data || []).map(notification => ({
        ...notification,
        actor: notification.actor_id_c ? {
          Id: notification.actor_id_c.Id,
          username_c: notification.actor_id_c.username_c,
          profile_picture_c: notification.actor_id_c.profile_picture_c
        } : null
      }))
    } catch (error) {
      console.error("Error fetching user notifications:", error?.response?.data?.message || error)
      return []
    }
  },

  async getUnreadCount(userId) {
    try {
      const notifications = await this.getByUserId(userId)
      return notifications.filter(n => !n.read_c).length
    } catch (error) {
      console.error("Error getting unread count:", error?.response?.data?.message || error)
      return 0
    }
  },

  async create(notificationData) {
    try {
      const apperClient = getApperClient()
      const response = await apperClient.createRecord('notification_c', {
        records: [{
          Name: "Notification",
          message_c: notificationData.message_c,
          type_c: notificationData.type_c,
          read_c: false,
          target_id_c: notificationData.target_id_c || "",
          actor_id_c: parseInt(notificationData.actor_id_c),
          user_id_c: parseInt(notificationData.user_id_c)
        }]
      })

      if (!response.success) {
        console.error(response.message)
        throw new Error("Failed to create notification")
      }

      if (response.results && response.results.length > 0) {
        const successful = response.results.filter(r => r.success)
        return successful[0]?.data || null
      }

      return null
    } catch (error) {
      console.error("Error creating notification:", error?.response?.data?.message || error)
      throw error
    }
  },

  async update(id, updates) {
    try {
      const apperClient = getApperClient()
      const updateData = { Id: parseInt(id) }
      
      if (updates.read_c !== undefined) updateData.read_c = updates.read_c
      if (updates.message_c !== undefined) updateData.message_c = updates.message_c

      const response = await apperClient.updateRecord('notification_c', {
        records: [updateData]
      })

      if (!response.success) {
        console.error(response.message)
        throw new Error("Failed to update notification")
      }

      if (response.results && response.results.length > 0) {
        const successful = response.results.filter(r => r.success)
        return successful[0]?.data || null
      }

      return null
    } catch (error) {
      console.error("Error updating notification:", error?.response?.data?.message || error)
      throw error
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient()
      const response = await apperClient.deleteRecord('notification_c', {
        RecordIds: [parseInt(id)]
      })

      if (!response.success) {
        console.error(response.message)
        throw new Error("Failed to delete notification")
      }

      return true
    } catch (error) {
      console.error("Error deleting notification:", error?.response?.data?.message || error)
      throw error
    }
  },

  async markAsRead(id) {
    return this.update(id, { read_c: true })
  },

  async markAllAsRead(userId) {
    try {
      const notifications = await this.getByUserId(userId)
      const unreadNotifications = notifications.filter(n => !n.read_c)

      for (const notification of unreadNotifications) {
        await this.update(notification.Id, { read_c: true })
      }

      return unreadNotifications.length
    } catch (error) {
      console.error("Error marking all as read:", error?.response?.data?.message || error)
      return 0
    }
  }
}