function buyBuilding() {
   var bestDeal = 0;
   var dealId = -1;
   for(var i in Game.ObjectsById) {
      var me = Game.ObjectsById[i];
      if(me.amount == 0) {
         me.buy();
      }
      var deal = me.storedTotalCps / me.amount * Game.globalCpsMult / me.price;
      if(deal > bestDeal) {
         if(me.price < Game.cookies) {
            bestDeal = deal;
            dealId = i;
         } 
      }
   }
   if(dealId > -1) {
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
      if((Game.UpgradesInStore.length == 0) || ((firstUpgrade.getPrice() / 10) >= Game.cookies)) {
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
