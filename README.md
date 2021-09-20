# Chord-Progression-Manager
---

RESTful API that allows management of users and their guitar chord progressions through CRUD operations. JSON web tokens are used to authenticate users.

The API accepts string tab representations of chord shapes as well as the name of the chord. For example, an A minor could be represented as 'x02210' where each
number corresponds to the fret on a string. The API currently doesn't have functionality to differentiate between different tunings and the standard EADGBE tuning
should be assumed. 

Mongoose ODM is used to model user and progression javascript objects. 
