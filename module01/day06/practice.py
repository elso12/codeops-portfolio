# ==========================================
# 1. CLASS DEFINITIONS (Must come first!)
# ==========================================

class Report:
    def __init__(self, title, content):
        self.title = title
        self.content = content

    def generate_report(self):
        return f"--- {self.title} ---\n{self.content}"


class ReportRepository:
    def save_to_file(self, report: Report, filename: str):
        with open(filename, "w") as f:
            f.write(report.generate_report())
        print(f"Report saved to {filename}")


class NotificationService:
    def send_email(self, report: Report, recipient: str):
        print(f"Sending email to {recipient} with report titled: '{report.title}'")


# ==========================================
# 2. RUNNER CODE (Must come last!)
# ==========================================

# Create the report data
my_report = Report("Day 6 Progress", "Today we are mastering SOLID principles!")

# Save it using the repository
saver = ReportRepository()
saver.save_to_file(my_report, "progress_report.txt")

# Send it using the notification service
notifier = NotificationService()
notifier.send_email(my_report, "student@ibtcollege.com")
# ==========================================
# EXERCISE 2: Refactor to OCP
# ==========================================

# 1. Base Class (The contract)
class Shape:
    def area(self):
        raise NotImplementedError("Subclasses must implement this method")

# 2. Concrete Shape Extensions
class Circle(Shape):
    def __init__(self, radius):
        self.radius = radius

    def area(self):
        return 3.14 * (self.radius ** 2)

class Square(Shape):
    def __init__(self, side):
        self.side = side

    def area(self):
        return self.side ** 2

# Look how easy it is to add a Triangle without touching Circle or Square!
class Triangle(Shape):
    def __init__(self, base, height):
        self.base = base
        self.height = height

    def area(self):
        return 0.5 * self.base * self.height


# 3. The Calculator (Closed for modification, open to any new Shape!)
class AreaCalculator:
    def calculate(self, shape: Shape):
        return shape.area()


# ==========================================
# EXERCISE 2 RUNNER CODE
# ==========================================
print("\n--- Exercise 2 Output ---")
calc = AreaCalculator()

shapes = [
    Circle(5),
    Square(4),
    Triangle(10, 5)
]

for shape in shapes:
    print(f"Area of {type(shape).__name__}: {calc.calculate(shape)}")
    # ==========================================
# EXERCISE 3: Write a Singleton
# ==========================================

class AppSettings:
    _instance = None  # This will store our single instance

    def __new__(cls):
        # If no instance exists yet, create one
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            # Initialize our settings once
            cls._instance.currency = "ETB"
        return cls._instance


# ==========================================
# EXERCISE 3 RUNNER CODE
# ==========================================
print("\n--- Exercise 3 Output ---")

# Try to create two separate instances
settings1 = AppSettings()
settings2 = AppSettings()

# Check if they point to the exact same place in memory
print(f"AppSettings instance 1 currency: {settings1.currency}")
print(f"AppSettings instance 2 currency: {settings2.currency}")
print(f"Are both instances the exact same object? {settings1 is settings2}")
# ==========================================
# EXERCISE 4: Write a Factory
# ==========================================

class ShapeFactory:
    @staticmethod
    def create(kind, *args):
        """
        Centralized factory method to create shapes.
        *args allows us to pass different numbers of arguments 
        (e.g., 1 for Circle/Square radius/side, 2 for Triangle base/height)
        """
        kind = kind.lower().strip()
        
        if kind == "circle":
            return Circle(args[0])
        elif kind == "square":
            return Square(args[0])
        elif kind == "triangle":
            return Triangle(args[0], args[1])
        else:
            raise ValueError(f"Unknown shape type: '{kind}'")


# ==========================================
# EXERCISE 4 RUNNER CODE
# ==========================================
print("\n--- Exercise 4 Output ---")

# Let's use the factory to generate our objects dynamically using strings
factory_shapes = [
    ShapeFactory.create("circle", 5),
    ShapeFactory.create("square", 4),
    ShapeFactory.create("triangle", 10, 5)
]

# Calculate areas to prove they are fully functional shape objects
calculator = AreaCalculator()
for shape in factory_shapes:
    shape_name = type(shape).__name__
    print(f"Factory created a {shape_name} with Area: {calculator.calculate(shape)}")
    # ==========================================
# EXERCISE 5: Write an Observer Pair
# ==========================================

# 1. The Subject (The News Agency)
class NewsAgency:
    def __init__(self):
        self._subscribers = []  # List to keep track of observers

    def subscribe(self, subscriber):
        """Add a subscriber to the list"""
        if subscriber not in self._subscribers:
            self._subscribers.append(subscriber)

    def unsubscribe(self, subscriber):
        """Remove a subscriber from the list"""
        if subscriber in self._subscribers:
            self._subscribers.remove(subscriber)

    def broadcast_news(self, news_flash: str):
        """Notify all subscribers about the new news"""
        for subscriber in self._subscribers:
            subscriber.update(news_flash)


# 2. The Observers (The Subscribers)
class TechBlog:
    def update(self, news_flash: str):
        print(f"[TechBlog] Writing an article about: '{news_flash}'")


class DailyNews:
    def update(self, news_flash: str):
        print(f"[DailyNews Printing Press] Breaking Headline: BREAKING - {news_flash}")


# ==========================================
# EXERCISE 5 RUNNER CODE
# ==========================================
print("\n--- Exercise 5 Output ---")

# Create our agency
agency = NewsAgency()

# Create our subscribers
blogger = TechBlog()
newspaper = DailyNews()

# Connect them
agency.subscribe(blogger)
agency.subscribe(newspaper)

# Broadcast some news! Both observers should react
agency.broadcast_news("AI masters the SOLID principles overnight!")

print("\n--- Unsubscribing TechBlog ---")
agency.unsubscribe(blogger)

# Broadcast again! Only DailyNews should react this time
agency.broadcast_news("Python remains the king of backend development.")