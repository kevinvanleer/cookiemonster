function buyBuilding() {
   var bestDeal = 0;
   var dealId = null;
   for(var i in Game.ObjectsById) {
      var me = Game.ObjectsById[i];
      if(me.amount == 0) {
         me.buy();
      }
      var deal = me.storedTotalCps / me.amount * Game.globalCpsMult / me.price;
      if(deal > bestDeal) {
         bestDeal = deal;
         dealId = i;
      }
   }
   if(dealId && Game.ObjectsById[dealId].price <= Game.cookies) {
      Game.ObjectsById[dealId].buy();
   }
}

function buySanta() {
   if(Game.Has('A festive hat') && Game.santaLevel < 14) {
      Game.santaLevel = Game.santaLevel + 1;
   }
}

function buyStuff() {
   buySanta();
   var firstUpgrade;
   for(var i = 0; i < Game.UpgradesInStore.length; i++) {
      firstUpgrade = Game.UpgradesInStore[i];
      if(firstUpgrade.name != "Elder Pledge" && firstUpgrade.name != "Elder Covenant") {
         break;
      }
   }
   if(Game.UpgradesInStore.length > 0 && firstUpgrade.getPrice() < Game.cookies) {
      firstUpgrade.buy();
   } else {
      const wait = firstUpgrade ? (firstUpgrade.getPrice() - Game.cookies) / Game.cookiesPs : 101;
      if((Game.UpgradesInStore.length == 0) || (wait > 100)) {
         buyBuilding();
      }
   }
}

function grabGoldenCookies() {
   while(document.getElementsByClassName('shimmer').length > 0) {
      document.getElementsByClassName('shimmer').item(0).click();
   }
}

function startBots() {
   dealGrabber = setInterval(buyStuff, 10);
   goldenCookieGrabber = setInterval(grabGoldenCookies, 1000);
   cookieClickBot = setInterval(function() { Game.ClickCookie(); }, 0);
   wrinklerPopper = setInterval(Game.CollectWrinklers, 1000 * 60 * 60)
}

function stopBots() {
   clearInterval(dealGrabber);
   clearInterval(goldenCookieGrabber);
   clearInterval(cookieClickBot);
   clearInterval(wrinklerPopper);
}

function restartBots() {
   stopBots();
   startBots();
}

function resetGame() {
   Game.CollectWrinklers();

   for(var i in Game.ObjectsById) {
      var me = Game.ObjectsById[i];
      me.sell(-1);
   }

   Game.Reset();
}

startBots();
