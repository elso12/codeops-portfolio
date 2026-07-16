class Book:
    def __init__(self,title,author,pages):
        self.author = author
        self.title = title
        self.pages = pages
    def describe(self):
        return f"{self.title} by {self.author}, {self.pages} pages"

b1 = Book("The Great Gatsby", "F. Scott Fitzgerald", 180)
b2 = Book("To Kill a Mockingbird", "Harper Lee", 281)
print(b1.describe())
print(b2.describe())