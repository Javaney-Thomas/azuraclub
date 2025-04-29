import { gql } from "@apollo/client";

export const GET_PRODUCTS_BY_CATEGORY = gql`
  query GetProductsByCategory($category: String!, $page: Int!, $limit: Int!) {
    products(category: $category, page: $page, limit: $limit) {
      id
      title
      description
      price
      category
      stock
      imageUrl
    }
    productsCount(category: $category)
  }
`;
export const GET_PRODUCT = gql`
  query GetProduct($id: ID!) {
    product(id: $id) {
      id
      title
      description
      price
      imageUrl
      category
      stock
    }
  }
`;
export const LOGIN_USER = gql`
  mutation LoginUser($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        name
        email
      }
    }
  }
`;

export const GET_PRODUCTS_BY_RELATED_VIEW = gql`
  query GetRelatedProducts {
    products(limit: 10) {
      id
      title
      description
      price
      category
      stock
      imageUrl
    }
  }
`;

export const GET_PRODUCTS = gql`
  query GetProducts(
    $page: Int!
    $limit: Int!
    $search: String
    $category: String
  ) {
    products(page: $page, limit: $limit, search: $search, category: $category) {
      id
      title
      description
      price
      category
      stock
      imageUrl
    }
    productsCount(search: $search, category: $category)
  }
`;
export const ADD_TO_CART = gql`
  mutation AddToCart($productId: ID!, $quantity: Int!) {
    addToCart(productId: $productId, quantity: $quantity) {
      id
      quantity
      product {
        id
        title
        price
        imageUrl
      }
    }
  }
`;
export const GET_CART = gql`
  query GetCart {
    cart {
      id
      quantity
      product {
        id
        title
        price
        imageUrl
      }
    }
  }
`;

export const UPDATE_CART_ITEM = gql`
  mutation UpdateCartItem($itemId: ID!, $quantity: Int!) {
    updateCartItem(itemId: $itemId, quantity: $quantity) {
      id
      quantity
    }
  }
`;

export const REMOVE_FROM_CART = gql`
  mutation RemoveFromCart($itemId: ID!) {
    removeFromCart(itemId: $itemId) {
      id
      quantity
      product {
        id
        title
        price
        imageUrl
      }
    }
  }
`;
export const CREATE_ORDER = gql`
  mutation CreateOrder($cartItems: [CartInput!]!, $paymentMethod: String!) {
    createOrder(cartItems: $cartItems, paymentMethod: $paymentMethod) {
      clientSecret
    }
  }
`;
export const GET_USER_PROFILE = gql`
  query GetUserProfile {
    profile {
      id
      name
      email
      role
    }
  }
`;
export const GET_USER_ORDERS = gql`
  query GetUserOrders {
    orders {
      id
      total
      status
      createdAt
      items {
        product {
          id
          title
          price
          imageUrl
        }
        quantity
      }
    }
  }
`;
// export const GET_ORDER = gql`
//   query GetOrder($id: ID!) {
//     order(id: $id) {
//       id
//       total
//       status
//       createdAt
//       items {
//         product {
//           id
//           title
//           price
//           imageUrl
//         }
//         quantity
//         price
//       }
//     }
//   }
// `;

export const GET_ORDER = gql`
  query GetOrder($id: ID!) {
    order(id: $id) {
      id
      user {
        id
        email
        name
      }
      items {
        product {
          id
          title
          price
          imageUrl
        }
        quantity
      }
      total
      status
      createdAt
    }
  }
`;
export const REGISTER_USER = gql`
  mutation RegisterUser($name: String!, $email: String!, $password: String!) {
    register(name: $name, email: $email, password: $password) {
      token
      user {
        id
        name
        email
      }
    }
  }
`;

export const GET_ANALYTICS_DATA = gql`
  query GetAnalyticsData {
    analyticsData {
      totalUsers
      totalProducts
      totalOrders
      productViews
      activeUsers
      mostViewedProducts {
        id
        title
        price
        imageUrl
      }
    }
  }
`;
export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      email
      role
    }
  }
`;
export const GET_LATEST_ORDERS = gql`
  query GetLatestOrders($limit: Int) {
    latestOrders(limit: $limit) {
      id
      total
      status
      createdAt
      items {
        product {
          id
          title
          price
          imageUrl
        }
        quantity
      }
    }
  }
`;
export const GET_All_ORDERS = gql`
  query GetallOrders($limit: Int) {
    allOrders(limit: $limit) {
      id
      total
      status
      createdAt
      user {
        id
        name
        email
      }
      items {
        product {
          id
          title
          price
          imageUrl
        }
        quantity
      }
    }
  }
`;
export const CREATE_PRODUCT = gql`
  mutation CreateProduct($file: Upload!, $input: ProductCreateInput!) {
    createProduct(file: $file, input: $input) {
      id
      title
      description
      price
      category
      stock
      imageUrl
    }
  }
`;
export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($id: ID!, $file: Upload, $input: ProductUpdateInput!) {
    updateProduct(id: $id, file: $file, input: $input) {
      id
      title
      description
      price
      category
      stock
      imageUrl
    }
  }
`;
export const UPDATE_PRODUCT_IMAGE = gql`
  mutation UpdateProductImage($id: ID!, $file: Upload!) {
    updateProductImage(id: $id, file: $file) {
      id
      imageUrl
    }
  }
`;
export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id) {
      id
    }
  }
`;
export const UPDATE_ORDER_STATUS = gql`
  mutation UpdateOrderStatus($orderId: ID!, $status: String!) {
    updateOrderStatus(orderId: $orderId, status: $status) {
      id
      status
      createdAt
    }
  }
`;
export const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      email
      name
    }
  }
`;
export const GET_USER_ORDERS_BY_ID = gql`
  query GetUserOrdersById($userId: ID!) {
    userOrders(userId: $userId) {
      id
      total
      status
      createdAt
      items {
        product {
          id
          title
          price
          imageUrl
        }
        quantity
      }
    }
  }
`;
export const GET_ADMIN_DASHBOARD = gql`
  query GetAdminDashboard {
    adminDashboard {
      totalUsers
      activeUsers
      totalProducts
      totalOrders
      totalRevenue
      averageCartValue
      conversionRate
      cancellationRate
      mostViewedProducts {
        id
        title
        imageUrl
        price
        stock
      }
      mostSearchedProducts
      lowStockProducts {
        id
        title
        stock
      }
    }
  }
`;
export const CREATE_REVIEW = gql`
  mutation CreateReview($productId: ID!, $rating: Int!, $comment: String!) {
    createReview(productId: $productId, rating: $rating, comment: $comment) {
      id
      rating
      comment
      createdAt
      user {
        id
        name
        email
      }
      product {
        id
        title
        imageUrl
      }
    }
  }
`;
export const GET_REVIEWS = gql`
  query GetReviews($productId: ID!) {
    reviews(productId: $productId) {
      id
      rating
      comment
      createdAt
      user {
        id
        name
        email
      }
    }
  }
`;
export const CREATE_CHECKOUT_SESSION = gql`
  mutation CreateCheckoutSession($cartItems: [CartInput!]!) {
    createCheckoutSession(cartItems: $cartItems) {
      sessionId
    }
  }
`;
export const UPDATE_USER_ROLE = gql`
  mutation UpdateUserRole($id: ID!, $role: String!) {
    updateUserRole(id: $id, role: $role) {
      name
      email
      role
    }
  }
`;
export const DELETE_REVIEW = gql`
  mutation DeleteReview($id: ID!) {
    deleteReview(id: $id)
  }
`;

export const GET_ALL_CATEGORIES = gql`
  query GetAllCategories {
    allCategories {
      id
      name
      slug
      image
    }
  }
`;
