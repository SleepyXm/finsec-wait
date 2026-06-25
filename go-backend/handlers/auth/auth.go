package handlers

import (
	"database/sql"
	"net/http"

	"finsec-backend/structs"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgconn"
)

func Signup(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req structs.UserCreate
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		// Check email taken
		var exists string
		err := db.QueryRowContext(c, "SELECT id FROM users WHERE email = $1", req.Email).Scan(&exists)
		if err != nil && err != sql.ErrNoRows {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not check email"})
			return
		}
		if exists != "" {
			c.JSON(http.StatusConflict, gin.H{"error": "Email already registered"})
			return
		}

		userID := uuid.New()

		tx, err := db.BeginTx(c, nil)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not start transaction"})
			return
		}
		defer tx.Rollback()

		_, err = tx.ExecContext(c,
			`INSERT INTO users (id, email, created_at)
             VALUES ($1, $2, NOW())`,
			userID, req.Email,
		)
		if err != nil {
			// Postgres unique violation error code
			if pgErr, ok := err.(*pgconn.PgError); ok && pgErr.Code == "23505" {
				c.JSON(http.StatusConflict, gin.H{"error": "Email already registered"})
				return
			}
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not create user"})
			return
		}

		if err = tx.Commit(); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not commit transaction"})
			return
		}

		c.JSON(http.StatusCreated, gin.H{"message": "User registered successfully"})
	}
}

func Counter(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var count int

		err := db.QueryRowContext(c, `SELECT COUNT(*) FROM users`).Scan(&count)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not fetch count"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"count": count})
	}
}
