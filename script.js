(function ($) {
    var o = $({});

    $.each(
        {
            trigger: "publish",
            on: "subscribe",
            off: "unsubscribe",
        },
        function (key, val) {
            jQuery[val] = function () {
                o[key].apply(o, arguments);
            };
        }
    );
})(jQuery);

let billy = (function () {
    let eventChanelRose = "fromBillyToRose";

    return {
        subscribe: function () {
            $.subscribe('fromRoseToBilly', function () {
                console.log('Rose : Hey, Billy')
                $.publish(eventChanelRose)
            })
        }
    }
})();

let jack = (function () {
    let channelEven = 'fromJackToRose';

    return {
        subscribe: function () {
            $.subscribe('fromRoseToJack', function () {
                console.log("Rose: Hello, Jack")
            })
        },
        publish: function () {
            $.publish(channelEven)
        }
    }
})();

let rose = (function () {
    let channelEvenBilly = 'fromRoseToBilly';
    let channelEvenJack = 'fromRoseToJack';


    return {
        subscribe: function () {
            $.subscribe('fromJackToRose', function () {
                console.log("Jack : Flirt to Rose")
                $.publish(channelEvenBilly)
            })
            $.subscribe('fromBillyToRose', function () {
                console.log('Billy : Bye. I run away!')
                $.publish(channelEvenJack)
            })
        }
    }
})()


rose.subscribe()
billy.subscribe();
jack.subscribe()
jack.publish();



// ----------------------------
// -----------------------
// -------------------
console.log('--------------------Pub/sub')

const EventBus = {
    channels: [],
    subscribe(eventChannel, listener) {
        if (!this.channels[eventChannel]) {
            this.channels[eventChannel] = [];
        }
        this.channels[eventChannel].push(listener)
    },
    publish(eventChannel, data) {
        const channel = this.channels[eventChannel]
        if (!channel) {
            return
        }
        channel.forEach(listener => listener(data))
    }
}


class Rose {
    constructor(params) {
        this.params = params;
        EventBus.subscribe('fromRose', this.sendMessageToBilly)
        EventBus.subscribe('fromRoseToJack', this.sendMessageToJack)
    }

    sendMessageToBilly(params) {
        console.log(`Rose: Hey, ${params.names}`)
    }

    chatWithJack() {
        EventBus.publish('toRoseFromJack', {
            names: this.params.names
        })
    }

    chatWithBilly() {
        EventBus.publish('toRoseFromBilly', {
            names: this.params.names
        })
    }

    sendMessageToJack(params) {
        console.log(`Rose: Hello ${params.names}`)
    }
}

class Billy {
    constructor(params) {
        this.params = params
        EventBus.subscribe('toRoseFromBilly', this.reactionToMessage)
    }

    chatWithRose() {
        EventBus.publish('fromRose', {
            names: this.params.names
        })
    }

    reactionToMessage(params) {
        console.log(`Billy: Run from ${params.names}`)
    }

}

class Jack {
    constructor(params) {
        this.params = params
        EventBus.subscribe('toRoseFromJack', this.reactionToMessage)
    }

    chatWithRose() {
        EventBus.publish('fromRoseToJack', {
            names: this.params.names
        })
    }

    reactionToMessage(params) {
        console.log(`Jack: Flirt to ${params.names}`)
    }

}

let rosePubSub = new Rose({names: 'Rose'});
let billyPubSub = new Billy({names: 'Billy'});
let jackPubSub = new Jack({names: 'Jack'});
rosePubSub.chatWithJack();
billyPubSub.chatWithRose();
rosePubSub.chatWithBilly();
jackPubSub.chatWithRose();


