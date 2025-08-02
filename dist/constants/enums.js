"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventStatus = exports.BookingAction = exports.BookingStatus = exports.UserRole = void 0;
// User Roles
var UserRole;
(function (UserRole) {
    UserRole["USER"] = "user";
    UserRole["ADMIN"] = "admin";
})(UserRole || (exports.UserRole = UserRole = {}));
// Booking Status
var BookingStatus;
(function (BookingStatus) {
    BookingStatus["CONFIRMED"] = "Confirmed";
    BookingStatus["CANCELLED"] = "Cancelled";
})(BookingStatus || (exports.BookingStatus = BookingStatus = {}));
// Booking Action Log
var BookingAction;
(function (BookingAction) {
    BookingAction["BOOKED"] = "BOOKED";
    BookingAction["CANCELLED"] = "CANCELLED";
})(BookingAction || (exports.BookingAction = BookingAction = {}));
// Event Status (computed virtual field)
var EventStatus;
(function (EventStatus) {
    EventStatus["UPCOMING"] = "Upcoming";
    EventStatus["ONGOING"] = "Ongoing";
    EventStatus["COMPLETED"] = "Completed";
})(EventStatus || (exports.EventStatus = EventStatus = {}));
