## Asteroid Sample Application

### BlackPool Surplus Rentals Corp

BlackPool is an (imaginary) military equipment rental dealer with gun store outlets in major cities around the world. They need to replace their existing desktop reservation system with a new mobile app.

### What is the end user experience?

As a small country army general with a limited budget, I need to be able to rent weapons for an upcoming battle, so I can use them to defeat my enemy then return them to avoid paying full price.

Currently I have to make reservations from my laptop. Since my battalion is always on the move, it isn't practical from me to always pull out my laptop to rent some more ammunition. I need to be able to find the closest available weapons an ammo wherever I am and from my phone. 

I should be able to open the BlackPool Surplus Rentals App on my iPhone and see a map of nearby rental locations. I should be able to push a "list" button that takes me to a list of available weapons in the area. This area should only include what is visible on the map that I can manipulate. I should be able to filter this list of weapons by price, ammo type and distance.

Once I find the weapon I want to reserve I should be able to select it and enter the quantity I want to reserve. If I am not logged in the app should prompt me to register. The app should tell me if the quantity is available and if so that my reservation has been made.

### Features

 - Authenticates and verifies the identity of military officials.
 - Securely exposes inventory data to mobile applications.
 - Allow users to find weapons and ammo available **within a specific area**.
 - Allow users to reserve weapons for rental.

### REST APIs

 - `/weapons` exposes a queryable (filter, sort) collection of available weapons over HTTP / JSON
 - `/weapons/nearby?&lat=...&long=... or ?zip=...` returns a filtered set of available weapons nearby the requesting user
 - `/weapons/nearby?id=24&zip=94555` returns nearby weapons of id 24.
 - `/weapons/:id` returns a specific weapon from the inventory, with specific pricing and images
 - `/users/login` allows a customer to login
 - `/users/logout` allows a customer to logout

[Here are some sample usages of the REST APIs](sample-api-usage.md)

### Browser JavaScript APIs

*Note: Similar APIs available in iOS, Android, etc.*

**Weapon** _inherits from AsteroidObject_

A class generated by asteroid for working with weapon data.

_get weapons nearby_

    // weapons nearby
    var here = new Location();

    // custom `nearby` function
    Weapon.nearby(here, function (err, weapons) {
      console.log(weapons); // [...list of nearby weapons...]
    });
    
**RentalLocation** _inherits from Location (which is an AsteroidObject)_

A class generated by asteroid for working with rental location data.

_get all weapon locations within an area_

    RentalLocation.getInRadius({lat: loc.lat, long: loc.long, radius: 0.5}, function (err, locations) {
      console.log(locations); // [...list of locations...]
    });

**Reservation**

    var reservation = new Reservation();
    var me = User.getCurrentUser();

    if(me) {
      reservation.set({weapons: [1, 2, 3], customer: me});
      reservation.save();
    } else {
      console.log('user must login...');
    }
    
**User** _inherits from AsteroidObject_

A class generated by asteroid for managing users.

    User.login({username: 'foo', password: 'bar'}, function(err, user) {
      console.log(user); // the currently logged in user
    });

    User.logout(); // logout current user

### Infrastructure

#### Customer Database

All customer information is available from the SalesForce api.

#### Inventory Database

All weapon inventory is already available in an **existing** Oracle X3-8 Exadata Database Machine in an extremely secure location.

The Inventory DB schema looks like this:

##### **Customers**
 - customer_id
 - name
 - country
 - military_agency
 
##### **Reservations**
 - status
 - customer_id
 - parent_reservation
 - product_id
 - product_qty
 - location_id
 - return_date
 
##### **Inventory_Levels**
 - product_id
 - inventory_date
 - location_id
 - qty_in_stock
 
##### **Products**
 - product_id
 - product_name
 - qty_in_stock
 
##### **Location**
 - location_id
 - address
 - city
 - state
 - name

##### **Inventory_View**

**View** to return qty of available products for the given city.

 - product (product name)
 - location (location name)
 - available (qty available)

#### Geo Lookup

Google's location API is used to return the users city from a given zip or lat/long.