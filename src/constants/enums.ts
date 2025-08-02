// User Roles
export enum UserRole {
    USER = 'user',
    ADMIN = 'admin',
  }
  
  // Booking Status
  export enum BookingStatus {
    CONFIRMED = 'Confirmed',
    CANCELLED = 'Cancelled',
  }
  
  // Booking Action Log
  export enum BookingAction {
    BOOKED = 'BOOKED',
    CANCELLED = 'CANCELLED',
  }
  
  // Event Status (computed virtual field)
  export enum EventStatus {
    UPCOMING = 'Upcoming',
    ONGOING = 'Ongoing',
    COMPLETED = 'Completed',
  }
  