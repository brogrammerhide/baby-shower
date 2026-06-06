Currently Guests can make a change and reserve gift registry without making RSVP response. 
that is not good. 
for instance, GuestA reserve the gift with her Iphone
and GuestA wants to come back and change it, she now uses different device, like office laptop
she sees that her gift is NOT saved but the count is 1, she thinks that Gift she reserved is NOT stored correctly in our DB
she reserve again, now the gift count is 2. When she gets home, she uses her ipad and again, the same thing
and she does make the same change, and now the count of the gift is 3
GuestB sees it and count is 3. but infact this is 1

Do you see the issue? 
So I want to make sure that this does not happen

- [x] fix is to remove Gift registry and we create its own dedicated component that Guest can only access either of
    - [x] first make RSVP and after the successful message, we show the link to bring user to Gift Registry page with the same Sidebar
    - [x] once user submit the RSVP and through Find My Registry -> then we will have an button saying Check my Gift Registry which will also toggle the button to go back to RSVP if user wants to edit
