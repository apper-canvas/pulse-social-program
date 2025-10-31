import { getApperClient } from "@/services/apperClient"

export const postService = {
  async getAll() {
    try {
      const apperClient = getApperClient()
      const response = await apperClient.fetchRecords('post_c', {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "content_c" } },
          { field: { Name: "image_url_c" } },
          { field: { Name: "likes_c" } },
          { field: { Name: "reactions_c" } },
          { field: { Name: "comment_count_c" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "author_id_c" }, referenceField: { field: { Name: "username_c" } } },
          { field: { Name: "author_id_c" }, referenceField: { field: { Name: "profile_picture_c" } } },
          { field: { Name: "author_id_c" }, referenceField: { field: { Name: "bio_c" } } }
        ],
        orderBy: [{ fieldName: "CreatedOn", sorttype: "DESC" }]
      })

      if (!response.success) {
        console.error(response.message)
        return []
      }

return (response.data || []).map(post => {
        // Safe parsing for likes_c - handles multiple formats
        let likes = [];
        if (post.likes_c) {
          try {
            if (Array.isArray(post.likes_c)) {
              likes = post.likes_c;
            } else if (typeof post.likes_c === 'string') {
              // Try parsing as JSON first
              try {
                likes = JSON.parse(post.likes_c);
              } catch {
                // If not JSON, might be comma-separated string
                likes = post.likes_c.split(',').filter(id => id.trim());
              }
            }
          } catch (error) {
            console.warn(`Failed to parse likes for post ${post.Id}:`, error);
            likes = [];
          }
        }

        // Safe parsing for reactions_c
        let reactions = {};
        if (post.reactions_c) {
          try {
            if (typeof post.reactions_c === 'object' && !Array.isArray(post.reactions_c)) {
              reactions = post.reactions_c;
            } else if (typeof post.reactions_c === 'string') {
              reactions = JSON.parse(post.reactions_c);
            }
          } catch (error) {
            console.warn(`Failed to parse reactions for post ${post.Id}:`, error);
            reactions = {};
          }
        }

        return {
          ...post,
          author: post.author_id_c ? {
            Id: post.author_id_c.Id,
            username_c: post.author_id_c.username_c,
            profile_picture_c: post.author_id_c.profile_picture_c,
            bio_c: post.author_id_c.bio_c
          } : null,
          likes,
          reactions
        };
      })
    } catch (error) {
      console.error("Error fetching posts:", error?.response?.data?.message || error)
      return []
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient()
      const response = await apperClient.getRecordById('post_c', parseInt(id), {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "content_c" } },
          { field: { Name: "image_url_c" } },
          { field: { Name: "likes_c" } },
          { field: { Name: "reactions_c" } },
          { field: { Name: "comment_count_c" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "author_id_c" }, referenceField: { field: { Name: "username_c" } } },
          { field: { Name: "author_id_c" }, referenceField: { field: { Name: "profile_picture_c" } } },
          { field: { Name: "author_id_c" }, referenceField: { field: { Name: "bio_c" } } }
        ]
      })

      if (!response.success) {
        console.error(response.message)
        throw new Error("Post not found")
      }

const post = response.data
      
      // Safe parsing for likes_c - handles multiple formats
      let likes = [];
      if (post.likes_c) {
        try {
          if (Array.isArray(post.likes_c)) {
            likes = post.likes_c;
          } else if (typeof post.likes_c === 'string') {
            try {
              likes = JSON.parse(post.likes_c);
            } catch {
              likes = post.likes_c.split(',').filter(id => id.trim());
            }
          }
        } catch (error) {
          console.warn(`Failed to parse likes for post ${post.Id}:`, error);
          likes = [];
        }
      }

      // Safe parsing for reactions_c
      let reactions = {};
      if (post.reactions_c) {
        try {
          if (typeof post.reactions_c === 'object' && !Array.isArray(post.reactions_c)) {
            reactions = post.reactions_c;
          } else if (typeof post.reactions_c === 'string') {
            reactions = JSON.parse(post.reactions_c);
          }
        } catch (error) {
          console.warn(`Failed to parse reactions for post ${post.Id}:`, error);
          reactions = {};
        }
      }

      return {
        ...post,
        author: post.author_id_c ? {
          Id: post.author_id_c.Id,
          username_c: post.author_id_c.username_c,
          profile_picture_c: post.author_id_c.profile_picture_c,
          bio_c: post.author_id_c.bio_c
        } : null,
        likes,
        reactions
      }
    } catch (error) {
      console.error(`Error fetching post ${id}:`, error?.response?.data?.message || error)
      throw new Error("Post not found")
    }
  },

  async getByUserId(userId) {
    try {
      const apperClient = getApperClient()
      const response = await apperClient.fetchRecords('post_c', {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "content_c" } },
          { field: { Name: "image_url_c" } },
          { field: { Name: "likes_c" } },
          { field: { Name: "reactions_c" } },
          { field: { Name: "comment_count_c" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "author_id_c" }, referenceField: { field: { Name: "username_c" } } },
          { field: { Name: "author_id_c" }, referenceField: { field: { Name: "profile_picture_c" } } },
          { field: { Name: "author_id_c" }, referenceField: { field: { Name: "bio_c" } } }
        ],
        where: [{ FieldName: "author_id_c", Operator: "EqualTo", Values: [parseInt(userId)] }],
        orderBy: [{ fieldName: "CreatedOn", sorttype: "DESC" }]
      })

      if (!response.success) {
        console.error(response.message)
        return []
      }

return (response.data || []).map(post => {
        // Safe parsing for likes_c - handles multiple formats
        let likes = [];
        if (post.likes_c) {
          try {
            if (Array.isArray(post.likes_c)) {
              likes = post.likes_c;
            } else if (typeof post.likes_c === 'string') {
              try {
                likes = JSON.parse(post.likes_c);
              } catch {
                likes = post.likes_c.split(',').filter(id => id.trim());
              }
            }
          } catch (error) {
            console.warn(`Failed to parse likes for post ${post.Id}:`, error);
            likes = [];
          }
        }

        // Safe parsing for reactions_c
        let reactions = {};
        if (post.reactions_c) {
          try {
            if (typeof post.reactions_c === 'object' && !Array.isArray(post.reactions_c)) {
              reactions = post.reactions_c;
            } else if (typeof post.reactions_c === 'string') {
              reactions = JSON.parse(post.reactions_c);
            }
          } catch (error) {
            console.warn(`Failed to parse reactions for post ${post.Id}:`, error);
            reactions = {};
          }
        }

        return {
          ...post,
          author: post.author_id_c ? {
            Id: post.author_id_c.Id,
            username_c: post.author_id_c.username_c,
            profile_picture_c: post.author_id_c.profile_picture_c,
            bio_c: post.author_id_c.bio_c
          } : null,
          likes,
          reactions
        };
      })
    } catch (error) {
      console.error("Error fetching user posts:", error?.response?.data?.message || error)
      return []
    }
  },

  async getFeedPosts(userId) {
    try {
      const apperClient = getApperClient()
      const response = await apperClient.fetchRecords('post_c', {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "content_c" } },
          { field: { Name: "image_url_c" } },
          { field: { Name: "likes_c" } },
          { field: { Name: "reactions_c" } },
          { field: { Name: "comment_count_c" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "author_id_c" }, referenceField: { field: { Name: "username_c" } } },
          { field: { Name: "author_id_c" }, referenceField: { field: { Name: "profile_picture_c" } } },
          { field: { Name: "author_id_c" }, referenceField: { field: { Name: "bio_c" } } }
        ],
        orderBy: [{ fieldName: "CreatedOn", sorttype: "DESC" }]
      })

      if (!response.success) {
        console.error(response.message)
        return []
      }

return (response.data || []).map(post => {
        // Safe parsing for likes_c - handles multiple formats
        let likes = [];
        if (post.likes_c) {
          try {
            if (Array.isArray(post.likes_c)) {
              likes = post.likes_c;
            } else if (typeof post.likes_c === 'string') {
              try {
                likes = JSON.parse(post.likes_c);
              } catch {
                likes = post.likes_c.split(',').filter(id => id.trim());
              }
            }
          } catch (error) {
            console.warn(`Failed to parse likes for post ${post.Id}:`, error);
            likes = [];
          }
        }

        // Safe parsing for reactions_c
        let reactions = {};
        if (post.reactions_c) {
          try {
            if (typeof post.reactions_c === 'object' && !Array.isArray(post.reactions_c)) {
              reactions = post.reactions_c;
            } else if (typeof post.reactions_c === 'string') {
              reactions = JSON.parse(post.reactions_c);
            }
          } catch (error) {
            console.warn(`Failed to parse reactions for post ${post.Id}:`, error);
            reactions = {};
          }
        }

        return {
          ...post,
          author: post.author_id_c ? {
            Id: post.author_id_c.Id,
            username_c: post.author_id_c.username_c,
            profile_picture_c: post.author_id_c.profile_picture_c,
            bio_c: post.author_id_c.bio_c
          } : null,
          likes,
          reactions
        };
      })
    } catch (error) {
      console.error("Error fetching feed posts:", error?.response?.data?.message || error)
      return []
    }
  },

  async create(postData) {
    try {
      const apperClient = getApperClient()
      const response = await apperClient.createRecord('post_c', {
        records: [{
          Name: postData.Name || "Post",
          content_c: postData.content_c || "",
          image_url_c: postData.image_url_c || "",
          author_id_c: parseInt(postData.author_id_c),
          likes_c: "[]",
          reactions_c: "{}",
          comment_count_c: 0
        }]
      })

      if (!response.success) {
        console.error(response.message)
        throw new Error("Failed to create post")
      }

      if (response.results && response.results.length > 0) {
        const successful = response.results.filter(r => r.success)
        const created = successful[0]?.data
        return {
          ...created,
          likes: [],
          reactions: {}
        }
      }

      return null
    } catch (error) {
      console.error("Error creating post:", error?.response?.data?.message || error)
      throw error
    }
  },

  async update(id, updates) {
    try {
      const apperClient = getApperClient()
      const updateData = { Id: parseInt(id) }
      
      if (updates.content_c !== undefined) updateData.content_c = updates.content_c
      if (updates.image_url_c !== undefined) updateData.image_url_c = updates.image_url_c
      if (updates.likes_c !== undefined) updateData.likes_c = JSON.stringify(updates.likes_c)
      if (updates.reactions_c !== undefined) updateData.reactions_c = JSON.stringify(updates.reactions_c)
      if (updates.comment_count_c !== undefined) updateData.comment_count_c = updates.comment_count_c

      const response = await apperClient.updateRecord('post_c', {
        records: [updateData]
      })

      if (!response.success) {
        console.error(response.message)
        throw new Error("Failed to update post")
      }

      if (response.results && response.results.length > 0) {
        const successful = response.results.filter(r => r.success)
        return successful[0]?.data || null
      }

      return null
    } catch (error) {
      console.error("Error updating post:", error?.response?.data?.message || error)
      throw error
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient()
      const response = await apperClient.deleteRecord('post_c', {
        RecordIds: [parseInt(id)]
      })

      if (!response.success) {
        console.error(response.message)
        throw new Error("Failed to delete post")
      }

      return true
    } catch (error) {
      console.error("Error deleting post:", error?.response?.data?.message || error)
      throw error
    }
  },

  async addReaction(postId, userId, emoji) {
    try {
      const post = await this.getById(postId)
      const reactions = post.reactions || {}
      const userIdStr = userId.toString()

      // Remove user from all other reactions
      Object.keys(reactions).forEach(e => {
        reactions[e] = reactions[e].filter(id => id !== userIdStr)
        if (reactions[e].length === 0) {
          delete reactions[e]
        }
      })

      // Add user to selected emoji
      if (!reactions[emoji]) {
        reactions[emoji] = []
      }
      if (!reactions[emoji].includes(userIdStr)) {
        reactions[emoji].push(userIdStr)
      }

      return await this.update(postId, { reactions_c: reactions })
    } catch (error) {
      console.error("Error adding reaction:", error?.response?.data?.message || error)
      throw error
    }
  },

  async removeReaction(postId, userId) {
    try {
      const post = await this.getById(postId)
      const reactions = post.reactions || {}
      const userIdStr = userId.toString()

      // Remove user from all reactions
      Object.keys(reactions).forEach(emoji => {
        reactions[emoji] = reactions[emoji].filter(id => id !== userIdStr)
        if (reactions[emoji].length === 0) {
          delete reactions[emoji]
        }
      })

      return await this.update(postId, { reactions_c: reactions })
    } catch (error) {
      console.error("Error removing reaction:", error?.response?.data?.message || error)
      throw error
    }
  }
}