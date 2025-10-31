import { getApperClient } from "@/services/apperClient"

export const messageService = {
  async getAll() {
    try {
      const apperClient = getApperClient()
      const response = await apperClient.fetchRecords('message_c', {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "content_c" } },
          { field: { Name: "conversation_id_c" } },
          { field: { Name: "read_c" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "sender_id_c" }, referenceField: { field: { Name: "username_c" } } },
          { field: { Name: "sender_id_c" }, referenceField: { field: { Name: "profile_picture_c" } } }
        ]
      })

      if (!response.success) {
        console.error(response.message)
        return []
      }

      return (response.data || []).map(message => ({
        ...message,
        sender: message.sender_id_c ? {
          Id: message.sender_id_c.Id,
          username_c: message.sender_id_c.username_c,
          profile_picture_c: message.sender_id_c.profile_picture_c
        } : null
      }))
    } catch (error) {
      console.error("Error fetching messages:", error?.response?.data?.message || error)
      return []
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient()
      const response = await apperClient.getRecordById('message_c', parseInt(id), {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "content_c" } },
          { field: { Name: "conversation_id_c" } },
          { field: { Name: "read_c" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "sender_id_c" }, referenceField: { field: { Name: "username_c" } } },
          { field: { Name: "sender_id_c" }, referenceField: { field: { Name: "profile_picture_c" } } }
        ]
      })

      if (!response.success) {
        console.error(response.message)
        throw new Error("Message not found")
      }

      const message = response.data
      return {
        ...message,
        sender: message.sender_id_c ? {
          Id: message.sender_id_c.Id,
          username_c: message.sender_id_c.username_c,
          profile_picture_c: message.sender_id_c.profile_picture_c
        } : null
      }
    } catch (error) {
      console.error(`Error fetching message ${id}:`, error?.response?.data?.message || error)
      throw new Error("Message not found")
    }
  },

  async getByConversationId(conversationId) {
    try {
      const apperClient = getApperClient()
      const response = await apperClient.fetchRecords('message_c', {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "content_c" } },
          { field: { Name: "conversation_id_c" } },
          { field: { Name: "read_c" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "sender_id_c" }, referenceField: { field: { Name: "username_c" } } },
          { field: { Name: "sender_id_c" }, referenceField: { field: { Name: "profile_picture_c" } } }
        ],
        where: [{ FieldName: "conversation_id_c", Operator: "EqualTo", Values: [conversationId] }],
        orderBy: [{ fieldName: "CreatedOn", sorttype: "ASC" }]
      })

      if (!response.success) {
        console.error(response.message)
        return []
      }

      return (response.data || []).map(message => ({
        ...message,
        sender: message.sender_id_c ? {
          Id: message.sender_id_c.Id,
          username_c: message.sender_id_c.username_c,
          profile_picture_c: message.sender_id_c.profile_picture_c
        } : null
      }))
    } catch (error) {
      console.error("Error fetching conversation messages:", error?.response?.data?.message || error)
      return []
    }
  },

  async getConversations(userId) {
    try {
      const apperClient = getApperClient()
      const response = await apperClient.fetchRecords('message_c', {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "content_c" } },
          { field: { Name: "conversation_id_c" } },
          { field: { Name: "read_c" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "sender_id_c" }, referenceField: { field: { Name: "username_c" } } },
          { field: { Name: "sender_id_c" }, referenceField: { field: { Name: "profile_picture_c" } } }
        ],
        orderBy: [{ fieldName: "CreatedOn", sorttype: "DESC" }]
      })

      if (!response.success) {
        console.error(response.message)
        return []
      }

      const messages = response.data || []
      const userIdStr = userId.toString()
      const conversationMap = new Map()

      messages.forEach(message => {
        const conversationId = message.conversation_id_c
        const participants = conversationId.split("-")

        if (participants.includes(userIdStr)) {
          if (!conversationMap.has(conversationId)) {
            conversationMap.set(conversationId, [])
          }
          conversationMap.get(conversationId).push(message)
        }
      })

      const conversations = []
      for (const [conversationId, msgs] of conversationMap) {
        const lastMessage = msgs[0]
        const unreadCount = msgs.filter(m => 
          m.sender_id_c?.Id?.toString() !== userIdStr && !m.read_c
        ).length

        conversations.push({
          Id: conversationId,
          conversationId,
          lastMessage,
          unreadCount,
          updatedAt: lastMessage.CreatedOn
        })
      }

      return conversations.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    } catch (error) {
      console.error("Error fetching conversations:", error?.response?.data?.message || error)
      return []
    }
  },

  async create(messageData) {
    try {
      const apperClient = getApperClient()
      const response = await apperClient.createRecord('message_c', {
        records: [{
          Name: "Message",
          content_c: messageData.content_c,
          sender_id_c: parseInt(messageData.sender_id_c),
          conversation_id_c: messageData.conversation_id_c,
          read_c: false
        }]
      })

      if (!response.success) {
        console.error(response.message)
        throw new Error("Failed to create message")
      }

      if (response.results && response.results.length > 0) {
        const successful = response.results.filter(r => r.success)
        return successful[0]?.data || null
      }

      return null
    } catch (error) {
      console.error("Error creating message:", error?.response?.data?.message || error)
      throw error
    }
  },

  async update(id, updates) {
    try {
      const apperClient = getApperClient()
      const updateData = { Id: parseInt(id) }
      
      if (updates.read_c !== undefined) updateData.read_c = updates.read_c
      if (updates.content_c !== undefined) updateData.content_c = updates.content_c

      const response = await apperClient.updateRecord('message_c', {
        records: [updateData]
      })

      if (!response.success) {
        console.error(response.message)
        throw new Error("Failed to update message")
      }

      if (response.results && response.results.length > 0) {
        const successful = response.results.filter(r => r.success)
        return successful[0]?.data || null
      }

      return null
    } catch (error) {
      console.error("Error updating message:", error?.response?.data?.message || error)
      throw error
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient()
      const response = await apperClient.deleteRecord('message_c', {
        RecordIds: [parseInt(id)]
      })

      if (!response.success) {
        console.error(response.message)
        throw new Error("Failed to delete message")
      }

      return true
    } catch (error) {
      console.error("Error deleting message:", error?.response?.data?.message || error)
      throw error
    }
  },

  async markAsRead(id) {
    return this.update(id, { read_c: true })
  },

  async markConversationAsRead(conversationId, userId) {
    try {
      const messages = await this.getByConversationId(conversationId)
      const userIdStr = userId.toString()
      const unreadMessages = messages.filter(
        m => m.sender_id_c?.Id?.toString() !== userIdStr && !m.read_c
      )

      for (const message of unreadMessages) {
        await this.update(message.Id, { read_c: true })
      }

      return unreadMessages.length
    } catch (error) {
      console.error("Error marking conversation as read:", error?.response?.data?.message || error)
      return 0
    }
  }
}