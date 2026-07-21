# 1. The Report class: ONLY responsible for managing data and formatting the content
class Report:
    def __init__(self, title, content):
        self.title = title
        self.content = content

    def generate_report(self):
        return f"--- {self.title} ---\n{self.content}"


# 2. The ReportRepository: ONLY responsible for data persistence (saving files)
class ReportRepository:
    def save_to_file(self, report: Report, filename: str):
        with open(filename, "w") as f:
            f.write(report.generate_report())
        print(f"Report saved to {filename}")


# 3. The NotificationService: ONLY responsible for delivery/communication
class NotificationService:
    def send_email(self, report: Report, recipient: str):
        # In a real app, this would use an email library like smtplib
        print(f"Sending email to {recipient} with report titled: '{report.title}'")