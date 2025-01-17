/*
  Do not change the line below. If you'd like to run code from this file, you may use the `exampleTicketData` variable below to gain access to tickets data. This data is pulled from the `data/tickets.js` file.

  You may use this data to test your functions. You may assume the shape of the data remains the same but that the values may change.

  Keep in mind that your functions must still have and use a parameter for accepting all tickets.
*/
const exampleTicketData = require("../data/tickets");
// Do not change the line above.

/**
 * calculateTicketPrice()
 * ---------------------
 * Returns the ticket price based on the ticket information supplied to the function. The `ticketInfo` will be in the following shape. See below for more details on each key.
 * const ticketInfo = {
    ticketType: "general",
    entrantType: "child",
    extras: ["movie"],
  };
 *
 * If either the `ticketInfo.ticketType` value or `ticketInfo.entrantType` value is incorrect, or any of the values inside of the `ticketInfo.extras` key is incorrect, an error message should be returned.
 *
 * @param {Object} ticketData - An object containing data about prices to enter the museum. See the `data/tickets.js` file for an example of the input.
 * @param {Object} ticketInfo - An object representing data for a single ticket.
 * @param {string} ticketInfo.ticketType - Represents the type of ticket. Could be any string except the value "extras".
 * @param {string} ticketInfo.entrantType - Represents the type of entrant. Prices change depending on the entrant.
 * @param {string[]} ticketInfo.extras - An array of strings where each string represent a different "extra" that can be added to the ticket. All strings should be keys under the `extras` key in `ticketData`.
 * @returns {number} The cost of the ticket in cents.
 *
 * EXAMPLE:
 *  const ticketInfo = {
      ticketType: "general",
      entrantType: "adult",
      extras: [],
    };
    calculateTicketPrice(tickets, ticketInfo);
    //> 3000
 *  
 * EXAMPLE:
 *  const ticketInfo = {
      ticketType: "membership",
      entrantType: "child",
      extras: ["movie"],
    };
    calculateTicketPrice(tickets, ticketInfo);
    //> 2500

 * EXAMPLE:
 *  const ticketInfo = {
      ticketType: "general",
      entrantType: "kid", // Incorrect
      extras: ["movie"],
    };
    calculateTicketPrice(tickets, ticketInfo);
    //> "Entrant type 'kid' cannot be found."
 */
function calculateTicketPrice(ticketData, ticketInfo) {
  //extract keys from the ticket info using destructuring
  const { ticketType, entrantType, extras } = ticketInfo;

  //ticket type does not match an existing ticket type
  //include the or because it says it could be any string EXCEPT the value extras
  if (!ticketData[ticketType] || ticketData[ticketType] === "extras") {
    return `Ticket type '${ticketType}' cannot be found.`;
  }

  //entrant type does not match an existing entrant type
  if (!ticketData[ticketType]["priceInCents"][entrantType]) {
    return `Entrant type '${entrantType}' cannot be found.`;
  }

  //Access the base price by navigating in the 'ticketData' object.
  //the basePrice is dependent on the ticketType and entrantType (entrant type is nested in the priceInCents)
  let basePrice = ticketData[ticketType]["priceInCents"][entrantType];
  //Set up an accumulator for the extras price since it's an array of options
  //assume ppl will not choose extras, so we will start this at $0
  let extrasPrice = 0;

  //Loop through all of the extras options
  for (let extra of extras) {
    if (!ticketData["extras"][extra]) {
      //End the function with an error message if an "extra" doesn't exist
      return `Extra type '${extra}' cannot be found.`;
    }

    //can assume all of the below exist because, in the error codes above we already did our checks for it they DO NOT exist. Therefore we wouldnt even reach this point if it didnt
    extrasPrice += ticketData["extras"][extra]["priceInCents"][entrantType];
  }
  //Final value should be the total of the base price and extra price
  return basePrice + extrasPrice;
}

/**
 * purchaseTickets()
 * ---------------------
 * Returns a receipt based off of a number of purchase. Each "purchase" maintains the shape from `ticketInfo` in the previous function.
 *
 * Any errors that would occur as a result of incorrect ticket information should be surfaced in the same way it is in the previous function.
 * 
 * NOTE: Pay close attention to the format in the examples below and tests. You will need to have the same format to get the tests to pass.
 *
 * @param {Object} ticketData - An object containing data about prices to enter the museum. See the `data/tickets.js` file for an example of the input.
 * @param {Object[]} purchases - An array of objects. Each object represents a single ticket being purchased.
 * @param {string} purchases[].ticketType - Represents the type of ticket. Could be any string except the value "extras".
 * @param {string} purchases[].entrantType - Represents the type of entrant. Prices change depending on the entrant.
 * @param {string[]} purchases[].extras - An array of strings where each string represent a different "extra" that can be added to the ticket. All strings should be keys under the `extras` key in `ticketData`.
 * @returns {string} A full receipt, with each individual ticket bought and the total.
 *
 * EXAMPLE:
 *  const purchases = [
      {
        ticketType: "general",
        entrantType: "adult",
        extras: ["movie", "terrace"],
      },
      {
        ticketType: "general",
        entrantType: "senior",
        extras: ["terrace"],
      },
      {
        ticketType: "general",
        entrantType: "child",
        extras: ["education", "movie", "terrace"],
      },
      {
        ticketType: "general",
        entrantType: "child",
        extras: ["education", "movie", "terrace"],
      },
    ];
    purchaseTickets(tickets, purchases);
    //> "Thank you for visiting the Dinosaur Museum!\n-------------------------------------------\nAdult General Admission: $50.00 (Movie Access, Terrace Access)\nSenior General Admission: $35.00 (Terrace Access)\nChild General Admission: $45.00 (Education Access, Movie Access, Terrace Access)\nChild General Admission: $45.00 (Education Access, Movie Access, Terrace Access)\n-------------------------------------------\nTOTAL: $175.00"

 * EXAMPLE:
    const purchases = [
      {
        ticketType: "discount", // Incorrect
        entrantType: "adult",
        extras: ["movie", "terrace"],
      }
    ]
    purchaseTickets(tickets, purchases);
    //> "Ticket type 'discount' cannot be found."
 */

function purchaseTickets(ticketData, purchases) {
  // Step 1: Initialize a variable to store a single ticket purchase.
  let ticketPurchase;

  // Step 2: Create the receipt header using template literals.
  let receipt = `Thank you for visiting the Dinosaur Museum!
-------------------------------------------
`;

  // Step 3: Initialize an accumulator for the total cost.
  let total = 0;

  // Step 4: Initialize a variable to store the cost of a single ticket.
  let costOfTicket;

  // Step 5: Loop through each ticket purchase in the 'purchases' array.
  for (let i = 0; i < purchases.length; i++) {
    // Get the current ticket purchase.
    ticketPurchase = purchases[i];

    // Calculate the cost of the ticket using the 'calculateTicketPrice' function.
    costOfTicket = calculateTicketPrice(ticketData, ticketPurchase);

    // Check if the cost is not a number (i.e., an error occurred in the calculation).
    if (typeof costOfTicket !== "number") {
      // Return the error message.
      return costOfTicket;
    }

    // Convert the cost of the ticket from cents to dollars.
    costOfTicket /= 100;

    // Add the cost of the ticket to the total.
    total += costOfTicket;

    // Check if there are no extras in the ticket purchase.
    if (ticketPurchase.extras.length === 0) {
      // Add a line to the receipt for the ticket purchase.
      receipt += `${
        ticketPurchase.entrantType[0].toUpperCase() +
        ticketPurchase.entrantType.substring(1)
      } ${
        ticketData[ticketPurchase.ticketType].description
      }: $${costOfTicket.toFixed(2)}
`;
    } else {
      // Add a line to the receipt for the ticket purchase with extras.
      receipt += `${
        ticketPurchase.entrantType[0].toUpperCase() +
        ticketPurchase.entrantType.substring(1)
      } ${
        ticketData[ticketPurchase.ticketType].description
      }: $${costOfTicket.toFixed(2)} (`;

      // Loop through each extra in the ticket purchase.
      for (let j = 0; j < purchases[i].extras.length; j++) {
        if (j !== purchases[i].extras.length - 1) {
          // Add extras to the receipt.
          receipt += `${purchases[i].extras[j][0].toUpperCase()}${purchases[
            i
          ].extras[j].substring(1)} Access, `;
        } else {
          // Add the last extra to the receipt and start a new line.
          receipt += `${purchases[i].extras[j][0].toUpperCase()}${purchases[
            i
          ].extras[j].substring(1)} Access)
`;
        }
      }
    }
  }

  // Step 6: Create a divider for the receipt.
  let divider = `-------------------------------------------
`;

  // Add the divider and total to the receipt.
  receipt += divider;
  receipt += `TOTAL: $${total.toFixed(2)}`;

  // Step 7: Return the complete receipt.
  return receipt;
}

// Do not change anything below this line.
module.exports = {
  calculateTicketPrice,
  purchaseTickets,
};
