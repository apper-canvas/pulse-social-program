import { getApperClient } from "@/services/apperClient"

export const userService = {
  async getAll() {
    try {
      const apperClient = getApperClient()
      const response = await apperClient.fetchRecords('user_c', {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "username_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "bio_c" } },
          { field: { Name: "profile_picture_c" } },
          { field: { Name: "cover_photo_c" } },
          { field: { Name: "location_c" } },
          { field: { Name: "friends_count_c" } },
          { field: { Name: "online_c" } },
          { field: { Name: "CreatedOn" } }
        ]
      })

      if (!response.success) {
        console.error(response.message)
        return []
      }

      return response.data || []
    } catch (error) {
      console.error("Error fetching users:", error?.response?.data?.message || error)
      return []
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient()
      const response = await apperClient.getRecordById('user_c', parseInt(id), {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "username_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "bio_c" } },
          { field: { Name: "profile_picture_c" } },
          { field: { Name: "cover_photo_c" } },
          { field: { Name: "location_c" } },
          { field: { Name: "friends_count_c" } },
          { field: { Name: "online_c" } },
          { field: { Name: "CreatedOn" } }
        ]
      })

      if (!response.success) {
        console.error(response.message)
        throw new Error("User not found")
      }

      return response.data
    } catch (error) {
      console.error(`Error fetching user ${id}:`, error?.response?.data?.message || error)
      throw new Error("User not found")
    }
  },

  async create(userData) {
    try {
      const apperClient = getApperClient()
      const response = await apperClient.createRecord('user_c', {
        records: [{
          Name: userData.Name || userData.username_c,
          username_c: userData.username_c,
          email_c: userData.email_c,
          bio_c: userData.bio_c || "",
          profile_picture_c: userData.profile_picture_c || "",
          cover_photo_c: userData.cover_photo_c || "",
          location_c: userData.location_c || "",
          friends_count_c: 0,
          online_c: true
        }]
      })

      if (!response.success) {
        console.error(response.message)
        throw new Error("Failed to create user")
      }

      if (response.results && response.results.length > 0) {
        const successful = response.results.filter(r => r.success)
        return successful[0]?.data || null
      }

      return null
    } catch (error) {
      console.error("Error creating user:", error?.response?.data?.message || error)
      throw error
    }
  },

  async update(id, updates) {
    try {
      const apperClient = getApperClient()
      const updateData = { Id: parseInt(id) }
      
      if (updates.username_c !== undefined) updateData.username_c = updates.username_c
      if (updates.email_c !== undefined) updateData.email_c = updates.email_c
      if (updates.bio_c !== undefined) updateData.bio_c = updates.bio_c
      if (updates.profile_picture_c !== undefined) updateData.profile_picture_c = updates.profile_picture_c
      if (updates.cover_photo_c !== undefined) updateData.cover_photo_c = updates.cover_photo_c
      if (updates.location_c !== undefined) updateData.location_c = updates.location_c
      if (updates.friends_count_c !== undefined) updateData.friends_count_c = updates.friends_count_c
      if (updates.online_c !== undefined) updateData.online_c = updates.online_c

      const response = await apperClient.updateRecord('user_c', {
        records: [updateData]
      })

      if (!response.success) {
        console.error(response.message)
        throw new Error("Failed to update user")
      }

      if (response.results && response.results.length > 0) {
        const successful = response.results.filter(r => r.success)
        return successful[0]?.data || null
      }

      return null
    } catch (error) {
      console.error("Error updating user:", error?.response?.data?.message || error)
      throw error
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient()
      const response = await apperClient.deleteRecord('user_c', {
        RecordIds: [parseInt(id)]
      })

      if (!response.success) {
        console.error(response.message)
        throw new Error("Failed to delete user")
      }

      return true
    } catch (error) {
      console.error("Error deleting user:", error?.response?.data?.message || error)
      throw error
    }
  },

  async getFriends(userId) {
    // Note: Friend relationships would need a separate junction table in production
    // For now, returning empty array as friend management requires additional schema
    return []
  },

  async getPendingRequests(userId) {
    // Note: Friend requests would need a separate table in production
    return []
  },

  async sendFriendRequest(fromUserId, toUserId) {
    // Note: Friend requests would need a separate table in production
    return true
  },

  async acceptFriendRequest(userId, requesterId) {
    // Note: Friend requests would need a separate table in production
    return true
  },

  async rejectFriendRequest(userId, requesterId) {
    // Note: Friend requests would need a separate table in production
    return true
  },

  async removeFriend(userId, friendId) {
    // Note: Friend relationships would need a separate table in production
    return true
  }
}