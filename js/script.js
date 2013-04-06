// Start button javascript

$(document).ready(function() {
	$('start-btn').click(function() {
		$('.start').remove()
	});
});

/*
 * Configuration.
 */

theyworkforyou_key = "EJGTp6C6GFRyDJRPJJBmaJRD"
theyworkforyou_api_root = "http://www.theyworkforyou.com/api/"
theyworkforyou_image_root = "http://www.theyworkforyou.com"
mp_popup_interval = 2000

/*
 * State.
 */

whackanmp = {}

output = $("#output")

/*
 * Behaviour.
 */

function random_int(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function get_party_css_style(party) {
    switch (party) {
        case "Labour": return "party-lab"
        case "Conservative": return "party-con"
        case "Liberal": return "party-lib"
        default: return "party-other"
    }
    return "party-lab"
}

function get_mps(success) {
    $.getJSON(
        theyworkforyou_api_root + "getMPs",
        {
            key: theyworkforyou_key,
            output: "js"
        },
        success
    )
}

function get_mp(person_id, success) {
    $.getJSON(
        theyworkforyou_api_root + "getMP",
        {
            key: theyworkforyou_key,
            output: "js",
            id: person_id
        },
        success
    )
}

// function get_mp_info(person_id, success) {
//     $.getJSON(
//         theyworkforyou_api_root + "getMPInfo",
//         {
//             key: theyworkforyou_key,
//             output: "js",
//             id: person_id
//         },
//         success
//     )
// }

// function get_n_mps(success) {
//     $.getJSON(
//         theyworkforyou_api_root + "getMPs",
//         {
//             key: theyworkforyou_key,
//             output: "js"
//         },
//         function(data, textStatus, jqXHR) {
//             mps = data
//             success(data.slice(0, n), textStatus, jqXHR)
//         }
//     )
// }

function init_mp_containers() {
    /*
     * Initialise MP containers.
     *
     * MP containers represent MP's in the interface
     * and store information associated with them.
    */

    // Attach data to mp containers from TheyWorkForYou API

    mp_callback = function(mp_id) {
        return function(data, textStatus, jqXHR) {
            // console.log(data)
            // console.log(mp_id)
            mp = data[0]
            //console.log(mp)
            mp_fullname = mp.full_name
            // console.log(mp_fullname)
            mp_party = mp.party
            // console.log(mp.party)
            mp_image_url = theyworkforyou_image_root + mp.image
            // console.log(mp_image_url)

            mp_container_el = whackanmp.mp_containers.get(mp_id)
            // console.log(mp_container_el)

            mp_image_el = $($('.mp-img')[mp_id])
            // console.log(mp_image_el)
            mp_image_el.css("background-image", "url(" + mp_image_url + ")")

            mp_el = $($('.mp')[mp_id])
            mp_el.addClass(get_party_css_style(mp_party))
        }
    }
   
    mps_callback = function(data, textStatus, jqXHR) {
        mps = data
        // console.log(mps)
        for (var mp_id=0; mp_id<12; mp_id++) {
            mp = mps[mp_id]
            // console.log(mp)
            mp_person_id = mp.person_id
            get_mp(mp_person_id, mp_callback(mp_id))
        }
    }

    get_mps(mps_callback)

    // Add event handlers to the containers.
    $(".mp").each(function(index, element) {
        mp_id = index
        mp_el = $(element)

        click_callback = function(mp_id) {
            return function(eventObject) {
                hide_mp(mp_id)
            }
        }

        mp_el.click(click_callback(mp_id))
    })
}

    // get_mps(function(data, textStatus, jqXHR) {
    //     mps = data
    //     for (var i=0; i<12; i++) {
    //         console.log(i)
    //         mp = mps[i]
    //         mp_person_id = mp.person_id

    //         get_mp(mp_person_id, function(data, textStatus, jqXHR) {
    //             mp = data[0]

    //             console.log(mp.full_name)
    //             console.log(mp.image)
    //             console.log(mp.party)

    //             console.log(i)

    //             mp_container = whackanmp.mp_containers.get(i)

    //             console.log(mp_container)
    //         })
    //     }
    // })



function show_random_mp() {
    show_mp(random_int(0,11))
}

function show_mp(mp_id) {
    mp_el = $($(".mp").eq(mp_id))
    mp_el.addClass("pop").delay(3000).removeClass("pop").addClass("show")
}

function hide_mp(mp_id) {
    mp_el = $($(".mp").eq(mp_id))
    mp_el.removeClass("show").addClass("pop").delay(3000).removeClass("show")
}

function start_game() {
    /*
     * Starts a new game.
     */
    $('.mp').each(function(index, element) {
        mp_el = $(element)

        mp_el.data("whack_count", 0)
        // console.log(mp_el.data("whack_count"))

        mp_el.removeClass("show")
        mp_el.removeClass("pop")

        // mp_el.addClass("show")
        // mp_el.addClass("pop")
    })

    whackanmp.show_random_mp_id = setInterval(show_random_mp, mp_popup_interval)
}

$(document).ready(function(){
    whackanmp.mp_containers = $(".mp-containter")

    init_mp_containers()

    start_game()
})

    // Populate mp containers with mp information.
    // 
    // Information for mp:
    // - name
    // - headshot
    // - party
    // - how many times they've been whacked.
    
    // get_mps(function(data, textStatus, jqXHR) {
    //     mps = data
    //     for (var i=0; i<12; i++) {
    //         console.log(i)
    //         mp = mps[i]
    //         mp_person_id = mp.person_id

    //         get_mp(mp_person_id, function(data, textStatus, jqXHR) {
    //             mp = data[0]

    //             console.log(mp.full_name)
    //             console.log(mp.image)
    //             console.log(mp.party)

    //             console.log(i)

    //             mp_container = whackanmp.mp_containers.get(i)

    //             console.log(mp_container)
    //         })
    //     }
    // })
