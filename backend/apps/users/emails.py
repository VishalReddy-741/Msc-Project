from django.core.mail import send_mail
from django.conf import settings
import logging

logger = logging.getLogger(__name__)


def send_welcome_email(user):
    if not settings.EMAIL_HOST_USER:
        return
    try:
        send_mail(
            subject="Welcome to ResearchFlow",
            message=(
                f"Hi {user.name},\n\n"
                f"Your ResearchFlow account has been created successfully.\n\n"
                f"Email: {user.email}\n"
                f"Role: {user.role.capitalize()}\n\n"
                f"You can now sign in and start using the platform.\n\n"
                f"Best regards,\n"
                f"ResearchFlow Team"
            ),
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=True,
        )
    except Exception as e:
        logger.warning(f"Failed to send welcome email to {user.email}: {e}")


def send_contact_email(name, email, topic, message):
    if not settings.EMAIL_HOST_USER:
        return False
    try:
        send_mail(
            subject=f"[ResearchFlow Support] {topic}",
            message=(
                f"New contact form submission\n\n"
                f"Name: {name}\n"
                f"Email: {email}\n"
                f"Topic: {topic}\n\n"
                f"Message:\n{message}"
            ),
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[settings.EMAIL_HOST_USER],
            fail_silently=False,
        )
        send_mail(
            subject="We received your message - ResearchFlow",
            message=(
                f"Hi {name},\n\n"
                f"Thank you for contacting ResearchFlow. We have received your message "
                f"regarding \"{topic}\" and will respond within 1 to 2 business days.\n\n"
                f"Best regards,\n"
                f"ResearchFlow Support Team"
            ),
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            fail_silently=True,
        )
        return True
    except Exception as e:
        logger.warning(f"Failed to send contact email: {e}")
        return False
