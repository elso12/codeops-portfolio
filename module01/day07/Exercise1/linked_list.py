class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

class LinkedList:
    def __init__(self):
        self.head = None

    def push_front(self, data):
        new_node = Node(data)
        new_node.next = self.head
        self.head = new_node

    def print_all(self):
        current = self.head
        while current:
            print(current.data)
            current = current.next

ll = LinkedList()
ll.push_front("Alice")
ll.push_front("Bob")
ll.push_front("Charlie")
ll.print_all()
