import { getApperClient } from "@/services/apperClient"

export const commentService = {
  async getAll() {
    try {
      const apperClient = getApperClient()
      const response = await apperClient.fetchRecords('comment_c', {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "content_c" } },
          { field: { Name: "post_id_c" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "author_id_c" }, referenceField: { field: { Name: "username_c" } } },
          { field: { Name: "author_id_c" }, referenceField: { field: { Name: "profile_picture_c" } } }
        ]
      })

      if (!response.success) {
        console.error(response.message)
        return []
      }

      return (response.data || []).map(comment => ({
        ...comment,
        author: comment.author_id_c ? {
          Id: comment.author_id_c.Id,
          username_c: comment.author_id_c.username_c,
          profile_picture_c: comment.author_id_c.profile_picture_c
        } : null
      }))
    } catch (error) {
      console.error("Error fetching comments:", error?.response?.data?.message || error)
      return []
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient()
      const response = await apperClient.getRecordById('comment_c', parseInt(id), {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "content_c" } },
          { field: { Name: "post_id_c" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "author_id_c" }, referenceField: { field: { Name: "username_c" } } },
          { field: { Name: "author_id_c" }, referenceField: { field: { Name: "profile_picture_c" } } }
        ]
      })

      if (!response.success) {
        console.error(response.message)
        throw new Error("Comment not found")
      }

      const comment = response.data
      return {
        ...comment,
        author: comment.author_id_c ? {
          Id: comment.author_id_c.Id,
          username_c: comment.author_id_c.username_c,
          profile_picture_c: comment.author_id_c.profile_picture_c
        } : null
      }
    } catch (error) {
      console.error(`Error fetching comment ${id}:`, error?.response?.data?.message || error)
      throw new Error("Comment not found")
    }
  },

  async getByPostId(postId) {
    try {
      const apperClient = getApperClient()
      const response = await apperClient.fetchRecords('comment_c', {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "content_c" } },
          { field: { Name: "post_id_c" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "author_id_c" }, referenceField: { field: { Name: "username_c" } } },
          { field: { Name: "author_id_c" }, referenceField: { field: { Name: "profile_picture_c" } } }
        ],
        where: [{ FieldName: "post_id_c", Operator: "EqualTo", Values: [parseInt(postId)] }],
        orderBy: [{ fieldName: "CreatedOn", sorttype: "ASC" }]
      })

      if (!response.success) {
        console.error(response.message)
        return []
      }

      return (response.data || []).map(comment => ({
        ...comment,
        author: comment.author_id_c ? {
          Id: comment.author_id_c.Id,
          username_c: comment.author_id_c.username_c,
          profile_picture_c: comment.author_id_c.profile_picture_c
        } : null
      }))
    } catch (error) {
      console.error("Error fetching comments for post:", error?.response?.data?.message || error)
      return []
    }
  },

  async create(commentData) {
    try {
      const apperClient = getApperClient()
      const response = await apperClient.createRecord('comment_c', {
        records: [{
          Name: "Comment",
          content_c: commentData.content_c,
          author_id_c: parseInt(commentData.author_id_c),
          post_id_c: parseInt(commentData.post_id_c)
        }]
      })

      if (!response.success) {
        console.error(response.message)
        throw new Error("Failed to create comment")
      }

      if (response.results && response.results.length > 0) {
        const successful = response.results.filter(r => r.success)
        return successful[0]?.data || null
      }

      return null
    } catch (error) {
      console.error("Error creating comment:", error?.response?.data?.message || error)
      throw error
    }
  },

  async update(id, updates) {
    try {
      const apperClient = getApperClient()
      const updateData = { Id: parseInt(id) }
      
      if (updates.content_c !== undefined) updateData.content_c = updates.content_c

      const response = await apperClient.updateRecord('comment_c', {
        records: [updateData]
      })

      if (!response.success) {
        console.error(response.message)
        throw new Error("Failed to update comment")
      }

      if (response.results && response.results.length > 0) {
        const successful = response.results.filter(r => r.success)
        return successful[0]?.data || null
      }

      return null
    } catch (error) {
      console.error("Error updating comment:", error?.response?.data?.message || error)
      throw error
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient()
      const response = await apperClient.deleteRecord('comment_c', {
        RecordIds: [parseInt(id)]
      })

      if (!response.success) {
        console.error(response.message)
        throw new Error("Failed to delete comment")
      }

      return true
    } catch (error) {
      console.error("Error deleting comment:", error?.response?.data?.message || error)
      throw error
    }
  },

  async likeComment(commentId, userId) {
    // Note: Like functionality would need additional fields in schema
    return true
  },

  async unlikeComment(commentId, userId) {
    // Note: Like functionality would need additional fields in schema
    return true
  }
}