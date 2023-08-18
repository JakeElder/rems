import { txt } from "@/remi";
import { Capability } from "@rems/types";


const capabilities: Capability[] = [
  {
    code: "NQ",
    name: "New Query",
    description: txt(
      <>
        Remi is able to understand search queries and show you suitable
        properties based on your requirements. You can be specific or speak
        generally, Remi will do her best to show you the best fitting properties
        to you.
      </>
    ),
    exampleTriggers: [
      txt(<>Show me 3 bedroom condos within 10km of $LANDMARK</>)
    ]
  },

  {
    code: "RQ",
    name: "Refine Query",
    description: txt(<>Remi is able to refine queries.</>),
    exampleTriggers: [
      txt(<>Actually, 2 bedrooms is enough</>),
      txt(<>Remove the 'City View' filter</>),
      txt(<>I should be able to bring my dog</>),
      txt(<>It needs to have a pool</>)
    ]
  },

  {
    code: "CQ",
    name: "Clear Query",
    description: txt(
      <>Remi can clear the search, resetting the listings to their defaults.</>
    ),
    exampleTriggers: [
      txt(<>Reset the search</>),
      txt(<>Actually let's start again</>)
    ]
  },

  {
    code: "SP",
    name: "Show Property",
    description: txt(
      <>
        When you've found a property that looks interesting, Remi can show you
        more details. Just tell her which property you're interested in by
        number or description and she will show you more details.
      </>
    ),

    exampleTriggers: [
      txt(<>Show me that third property</>),
      txt(<>Show me the "Scenic villa with mountain views"</>)
    ]
  },

  {
    code: "RV",
    name: "Request Viewing",
    description: txt(
      <>
        Once you've found a property you like, Remi can connect you to an agent
        so that you can see the property.
      </>
    ),
    exampleTriggers: [txt(<>Ok, I'd like to book a viewing</>)]
  },

  {
    code: "RGQ",
    name: "Respond to General Query",
    description: txt(
      <>
        Remi can just chat with you ¯\_(ツ)_/¯. Ask her a general question,
        about properties or anything else.
      </>
    ),

    exampleTriggers: [
      txt(<>Hey Remi, what's the best time of year to go to Japan?</>),
      txt(<>What's the square root of 6049261729?</>),
      txt(<>Do you know how to shot web?</>)
    ]
  }
];

export default capabilities;
