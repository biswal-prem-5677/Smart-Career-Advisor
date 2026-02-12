
import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

# Load env variables
load_dotenv()

def test_email():
    smtp_server = "smtp.gmail.com"
    smtp_port = 587
    sender_email = os.getenv("EMAIL_USER")
    sender_password = os.getenv("EMAIL_PASS")

    print("--- Email Configuration Test ---")
    print(f"EMAIL_USER: {sender_email}")
    print(f"EMAIL_PASS: {'*' * len(sender_password) if sender_password else 'Not Set'}")

    if not sender_email or "your_email" in sender_email:
        print("❌ Please update backend/.env with your actual email.")
        return

    if not sender_password or "your_app_password" in sender_password:
        print("❌ Please update backend/.env with your actual App Password.")
        return

    try:
        # Create message
        msg = MIMEMultipart()
        msg['From'] = sender_email
        msg['To'] = sender_email # Send to self for testing
        msg['Subject'] = "Smart Career Advisor - Test Email"
        msg.attach(MIMEText("If you see this, your email configuration works!", 'plain'))

        # Connect
        print("Connecting to SMTP server...")
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        
        print("Logging in...")
        server.login(sender_email, sender_password)
        
        print("Sending email...")
        server.sendmail(sender_email, sender_email, msg.as_string())
        server.quit()
        
        print("✅ Email sent successfully! Check your inbox.")
        
    except smtplib.SMTPAuthenticationError:
        print("❌ Authentication Failed. Please check your Email and App Password.")
        print("Tip: Make sure you are using an 'App Password', not your login password.")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_email()
