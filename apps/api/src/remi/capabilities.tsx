import { txt } from "@/remi";
import { Capability } from "@rems/types";

const capabilities: Capability[] = [
  {
    id: 1,
    code: "NEW_QUERY",
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
    id: 2,
    code: "REFINE_QUERY",
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
    id: 3,
    code: "CLEAR_QUERY",
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
    id: 4,
    code: "SHOW_PROPERTY",
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
    id: 5,
    code: "REQUEST_VIEWING",
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
    id: 6,
    code: "RESPOND_GENERAL_QUERY",
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
  },

  {
    id: 100,
    code: "REQUEST_CLARIFICATION",
    name: "Request Clarification",
    description: txt(
      <>
        When Remi is unsure about your intent or needs more information, she
        will ask for clarification to ensure she can provide the most suitable
        response or perform the most appropriate action.
      </>
    ),
    exampleTriggers: [
      txt(<>asdfghjkl</>),
      txt(<>Show me a 3-bedroom within...actually nevermind</>),
      txt(<>How do I...you know what?</>),
      txt(<>So, um, could you, like...</>)
    ]
  }
];

export default capabilities;
