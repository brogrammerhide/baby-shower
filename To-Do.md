# Auth
currently we dont need auth at all
delete them all for auth related code

# Account not needed
# Group is NOT needed
# RSVP shcema as below
```ts
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
    },
    attending: {
      type: Boolean,
      required: [true, 'Attendance status is required'],
      default: false,
    },
    guests: {
      type: Number,
      required: [true, 'Number of guests is required'],
      min: [1, 'Must have at least 1 attendee (the RSVP holder)'],
      default: 1,
    },
    dietaryRestrictions: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Dietary',
      },
    ],
    otherDietNotes: {
      type: String,
      trim: true,
      default: '',
    },
    estimateArrivalTime: {
      type: String,
      trim: true,
    },
    reservedGifts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Gift'
        }
    ]
  }
```

so in the form, if user selects NOT attending option, we will disable the number of the guess, or set to only zero
also on the left side of animalation, I think it is using lott whatever?
it used to be crying emoji animaiton when selecting not attending option but now its all check mark of animation ....
