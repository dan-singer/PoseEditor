var resultsPerPage = 12;
var pages = 0;
tags = [];

var animationsArray = []
$.blockUI();
firebase.database().ref("animations").orderByChild("name").once("value", function(ss) {
    var allAnimations = ss.val();
    Object.keys(allAnimations).forEach(function(animKey) {
        animationsArray.push(allAnimations[animKey]);
    });

    getVideos(1);
});

function matchTags() {
    var arrayLength = tags.length;
    var anim_final = [];
    if (arrayLength > 0 && !$.isEmptyObject(animationsArray)) {
        animationsArray.forEach(function(anim) {

            var count = 0;
            for (var t in anim['tags']) {
                for (var i = 0; i < arrayLength; i++) {
                    if (t == tags[i]) {
                        count++;
                    }
                }
            }
            if (count == arrayLength) {
                anim_final.push(anim);
            }
        });
    } else {
        return animationsArray;
        console.log("Returning original");
    }
    return anim_final;
}

function getVideos(page, th) {
    $.blockUI();
    if (th != undefined) {
        $(th).parent().parent().find(".active").toggleClass("active");
        $(th).parent().toggleClass("active");
    }
    var offset = (page - 1) * resultsPerPage;
    var blocks = '';
    var k = 1;
    var completed = 1;
    var anim_final = matchTags();
    console.log(anim_final);
    var data = anim_final.slice(offset, (page * resultsPerPage));
    if (!data.length) {
        // Add toast code to blocks variable
        $('.zodiacCont').html(blocks);
        $.unblockUI();
        console.log("No data");
    } else {
        data.forEach(function(anim) {
            // blocks += '<a data-url="' + animDownloadUrl + '" data-name="' + anim.name + '.anim" onclick="downloadFile(this)"><i class="fa fa-download fa-2x" aria-hidden="true"></i></a>';
            firebase.storage().ref("animFiles").child(anim.name + ".anim").getDownloadURL().then(function(animDownloadUrl) {
                firebase.storage().ref("mp4Files").child(anim.name + ".mp4").getDownloadURL().then(function(downloadUrl) {
                    blocks += '<div class="box box' + k + ' fadeInUp clust">';
                    blocks += '<div style="z-index: 111;">';
                    blocks += '<a class="newwwww" href="javascript:;" data-name="' + anim.name + '"><i class="fa fa-plus-circle fa-2x" aria-hidden="true" ></i></a>';
                    blocks += '<a data-url="' + animDownloadUrl + '" data-name="' + anim.name + '.anim" download href="' + animDownloadUrl + '"><i class="fa fa-download fa-2x" aria-hidden="true"></i></a>';
                    blocks += '<div class="animation-name">' + anim.name + '</div>';
                    blocks += '</div>';
                    blocks += '<video autoplay loop  muted>';
                    blocks += '<source src="' + downloadUrl + '" type="video/mp4" />';
                    blocks += '</video>';
                    blocks += '</div>';
                    console.log(animDownloadUrl);

                    k++;
                    if (k === completed) {
                        $('.zodiacCont').html(blocks);

                        $('.newwwww').click(function() {
                            if (firebase.auth().currentUser) {
                                var animName = $(this).data("name");
                                var userId = firebase.auth().currentUser.uid;
                                firebase.database().ref("usernames").child(userId).child("mylibrary").once("value", function(snap) {
                                    var libraryItems = snap.val();
                                    var exists = false;
                                    console.log(libraryItems);
                                    libraryItems && Object.keys(libraryItems).forEach(function(itemKey) {
                                        exists = exists || (libraryItems[itemKey] == animName);
                                    });
                                    if (!exists) {
                                        var newObjRef = firebase.database().ref("usernames").child(userId).child("mylibrary").push();
                                        newObjRef.set(animName);
                                        alert("Added to library");
                                    } else {
                                        alert("Already in library");
                                    }
                                })
                            } else {
                                $('#myModal').modal('show');
                            }
                        })

                        $.unblockUI();
                    }
                })
            })
            completed++;
        });
    }
}

firebase.database().ref("animations").orderByChild("name").once("value", function(ss) {
    ss = ss.val();
    pages = ss && Math.ceil(Object.keys(ss).length / resultsPerPage);
    var pageHTML = '<li class="active"><a href="javascript:;" onclick="getVideos(1, this);">1 <span class="sr-only">(current)</span></a></li>';
    for (var page = 2; page <= pages; page++) {
        pageHTML += '<li class=""><a href="javascript:;" onclick="getVideos(' + page + ', this);">' + page + ' <span class="sr-only">(current)</span></a></li>';
    }
    $('.repo-pages').html(pageHTML);
});

jQuery(document).ready(function() {

    firebase.database().ref("/tags/").once('value').then(function(snapshot) {

        var fireObject = snapshot.val();
        var t = 0;

        for (var key in fireObject) {
            var sabUl = "<ul class='nav nav-pills nav-stacked subMenuS'>";
            for (var b in fireObject[key]) {
                sabUl += "<li  class='subManuLi' data-name='" + fireObject[key][b] + "' role='presentation'><a href='javascript:;'>" + fireObject[key][b] + "</a></li>";
            }
            sabUl += "</ul>";
            var active = (t == 0) ? " class='active'" : '';
            $(".menuS").append('<li role="presentation"' + active + '><a href="javascript:;">' + key + '</a>' + sabUl + '</li>');
            ++t;
        }

        $(".subManuLi").off('click').on('click', function() {
            var subLi = '';
            if (!$(this).hasClass("activeTag")) {
                $(this).addClass("active activeTag");
                var name = $(this).attr('data-name');
                subLi += '<div class="pull-left closeDiv">';
                subLi += '<p class="pull-left filterP">' + $(this).html();
                subLi += '<button id="' + $(this).text() + '" class="pull-right closeBtn" data-name="' + name + '">X</button>' + '</p>';
                subLi += '</div>';
                $(".tagName").append(subLi);
                console.log($(this).text());
                tags.push($(this).text());
                selected = true;
                getVideos(1);

            }
            $(".closeBtn").off('click').on('click', function() {
                removeItem = $(this).attr('id');
                console.log("removeItem");
                console.log(removeItem);
                tags = jQuery.grep(tags, function(value) {
                    return value != removeItem;
                });

                var name = $(this).attr('data-name');
                $(this).parent().remove();
                $('.subMenuS li[data-name="' + name + '"]').removeClass('active activeTag');
                getVideos(1);
            });

        });
    });
    /*----------------------CloseButton---------------------*/
});