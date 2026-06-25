package utils

import (
	"fmt"

	"github.com/resend/resend-go/v2"
)

var resendClient *resend.Client

func InitResend() {
	resendClient = resend.NewClient(Cfg.ResendAPIKey)
}

func SendVerificationEmail(email, token string) error {
	verificationURL := fmt.Sprintf("%s/auth/verify?token=%s", Cfg.DevServerBackend, token)

	params := &resend.SendEmailRequest{
		From:    "team@devolib.com",
		To:      []string{email},
		Subject: "Verify your email",
		Html: fmt.Sprintf(`
            <h2>Welcome!</h2>
            <p>Click the link below to verify your email:</p>
            <a href="%s">Verify Email</a>
            <p>This link expires in 24 hours.</p>
        `, verificationURL),
	}

	_, err := resendClient.Emails.Send(params)
	return err
}
