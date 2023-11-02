// @ts-nocheck

import { txt } from "@/remi/utils";
import { Capability } from "@rems/types";

const capabilities: Capability[] = [
  {
    id: 1,
    code: "NEW_QUERY",
    description: md(
      <>
        Remi is able to understand search queries and show you suitable
        properties based on your requirements. You can be specific or speak
        generally, Remi will do her best to show you the best fitting properties
        to you.
      </>
    ),
    exampleTriggers: [
      md(<>Show me 3 bedroom condos within 10km of $LANDMARK</>)
    ]
  },

  {
    id: 2,
    code: "REFINE_QUERY",
    description: md(
      <>
        Remi is able to refine queries. Prefer to refine over start a new
        search. It is better to refine over start new when there is ambiguity.
      </>
    ),
    exampleTriggers: [
      md(<>Actually, 2 bedrooms is enough</>),
      md(<>Remove the 'City View' filter</>),
      md(<>I should be able to bring my dog</>)
    ]
  },

  {
    id: 3,
    code: "CLEAR_QUERY",
    description: md(
      <>
        Remi is able to refine queries. can clear the current query, returning
        to default.
      </>
    ),
    exampleTriggers: [md(<>Clear the query</>)]
  },

  // {
  //   id: 4,
  //   code: "SHOW_PROPERTY",
  //   description: md(
  //     <>
  //       When you've found a property that looks interesting, Remi can show you
  //       more details. Just tell her which property you're interested in by
  //       number or description and she will show you more details.
  //     </>
  //   ),

  //   exampleTriggers: [
  //     md(<>Show me that third property</>),
  //     md(<>Show me the "Scenic villa with mountain views"</>)
  //   ]
  // },

  // {
  //   id: 5,
  //   code: "REQUEST_VIEWING",
  //   description: md(
  //     <>
  //       Once you've found a property you like, Remi can connect you to an agent
  //       so that you can see the property.
  //     </>
  //   ),
  //   exampleTriggers: [md(<>Ok, I'd like to book a viewing</>)]
  // },

  {
    id: 6,
    code: "RESPOND_GENERAL_QUERY",
    description: md(
      <>
        Remi can just chat with you ¯\_(ツ)_/¯. Ask her a general question,
        about properties or anything else.
      </>
    ),

    exampleTriggers: [
      md(<>Hey Remi, what's the best time of year to go to Japan?</>),
      md(<>What's the square root of 6049261729?</>),
      md(<>Do you know how to shot web?</>)
    ]
  },

  {
    id: 100,
    code: "INFORM_MORE_INFO_NEEDED",
    description: md(
      <>
        When Remi is unsure about your intent or needs more information, she
        will ask for clarification to ensure she can provide the most suitable
        response or perform the most appropriate action.
      </>
    ),
    exampleTriggers: [
      md(<>asdfghjkl</>),
      md(<>Show me a 3-bedroom within...actually nevermind</>),
      md(<>So, um, could you, like...</>)
    ]
  }
];

export default capabilities;
