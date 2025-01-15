# **Dynamic Shopping Platform**


## **Description**
This project is a web-based application for managing a shopping cart and viewing detailed order history. It supports both regular users and administrators. Key features include:
- For **users**: Adding, removing, and adjusting items in the cart, proceeding to checkout, and viewing order history.
- For **administrators**: Managing the product list, including adding, editing, and removing products.
- **Polling Mechanism**: The application periodically fetches updates to ensure the product list and cart are always up-to-date.

The application features a user-friendly interface where functionality is naturally discoverable. Interactive elements such as buttons (`+`, `-`, `×`) and expandable sections guide the user intuitively without needing to reference this document.

---

### **1. Login**
- When accessing the application, users are prompted to log in with a valid username.
- Certain usernames, such as restricted accounts, will trigger appropriate error messages.
- Successfully logged-in users are granted either regular or admin access based on their account type. Currently, if the username is `Admin`, the user is granted access to the administrator page.

### **2. For Regular Users**
- **Add Items**: 
  Click the `+` button under products in the product list to add items to your cart. You can also use this button to increase the quantity one item at a time, as long as stock is available.
- **Adjust Quantities**: 
  Modify item quantities in the cart using the `+` or `-` buttons, or by entering a specific value in the quantity input field. The application ensures that quantities cannot exceed the available stock.
- **Remove Items**: 
  Click the `×` button in the cart to remove an item, including items that are currently invalid.
- **Checkout**: 
  Click the **Checkout** button in shopping cart to finalize your purchase. If no valid items are available in the cart, the checkout button will be hidden. During checkout, the stock is updated to reflect purchased items.
- **View Order History**: 
  Navigate to the "Orders" section to see all previous orders. Click an order to expand details, including order time, itemized quantities, and prices.

### **3. For Administrators**
- **Add Products**: 
  Use the "Add Products" form to create a new product with a name, price, and stock quantity.
- **Edit Products**: 
  Enter a valid new price and click the "Update" button under a product to modify its price or stock.
- **Remove Products**: 
  Click the "Remove" button to permanently remove a product from the list.

---

## **Setup**

### **Prerequisites**
- Ensure that you have Node.js and npm installed on your system.
- A modern web browser for accessing the application.

### **Steps to Run**
- The project must run with this series of commands: `npm install`, `npm run build`, `npm start`

---

## **Licensing and Resources**

### **Media**
- Images: Placeholder images are generated using `Placehold.co`, free for use.

### **Libraries and Frameworks**
- React: Interactive UI built with React, licensed under MIT.
- Vite: Development environment for fast builds, licensed under MIT.
