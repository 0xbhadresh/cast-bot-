import fetch from "node-fetch"; // For Node.js, Bun will automatically handle fetch
import "dotenv/config"; // Ensure you can access environment variables

// Type for the expected response data
interface SignerResponse {
  signer_uuid: string;
  public_key: string;
  status: string;
}

// Create signer and get signer UUID
async function createSigner(): Promise<string> {
  const url = "https://api.neynar.com/v2/farcaster/signer";
  const options = {
    method: "POST",
    headers: {
      accept: "application/json",
      "x-api-key": process.env.NEYNAR_API_KEY!, // Ensure the API key is set in the .env file
    },
  };

  try {
    const response = await fetch(url, options);
    const data: SignerResponse = await response.json(); // Type the response as SignerResponse

    if (response.ok) {
      console.log("Signer Created Successfully!");
      console.log("Signer UUID:", data.signer_uuid);
      return data.signer_uuid;
    } else {
      console.error("Error creating signer:", data);
      throw new Error("Failed to create signer");
    }
  } catch (error) {
    console.error(
      "Error processing request:",
      error instanceof Error ? error.message : error
    );
    throw error; // Re-throw the error to be handled in the calling context
  }
}

// Example usage
(async () => {
  try {
    const signerUuid = await createSigner();
    console.log("Your Signer UUID:", signerUuid);
  } catch (error) {
    console.error(
      "Failed to create signer:",
      error instanceof Error ? error.message : error
    );
  }
})();
