$(document).ready(function() {
    setTimeout(loadPage, 1500);
});

function loadPage() {
    if (firebase.auth().currentUser) {
        $.blockUI();
        var blocks = '';
        var k = 1;
        var completed = 1;
        var userId = firebase.auth().currentUser.uid;
        firebase.database().ref("usernames").child(userId).child("mylibrary").once("value", function(ss) {
            var animations = ss.val();
            if (!animations) {
                alert("No items in library");
                $.unblockUI();
            }
            animations && Object.keys(animations).forEach(function(animKey) {
                firebase.storage().ref("animFiles").child(animations[animKey] + ".anim").getDownloadURL().then(function(animDownloadUrl) {
                    firebase.storage().ref("mp4Files").child(animations[animKey] + ".mp4").getDownloadURL().then(function(downloadUrl) {
                        blocks += '<div class="box box' + k + ' fadeInUp clust" data-wow-delay="0.3s" data-page="#">';
                        blocks += '<video autoplay loop muted>';
                        blocks += '<source src="' + downloadUrl + '" type="video/mp4" />';
                        blocks += '</video>';
                        blocks += '<label class="fancy-checkbox">';
                        blocks += '<input type="checkbox" name="' + animKey + '"/>';
                        blocks += '<span></span>';
                        blocks += '</label>';
                        blocks += '<a class="downloadbutton" data-url="' + animDownloadUrl + '" data-name="' + animations[animKey] + '.anim" onclick="downloadFile(this)"><i class="fa fa-download fa-2x" aria-hidden="true"></i></a>';
                        blocks += '</div>';
                        k++;
                        if (k === completed) {
                            $('.zodiacCont').html(blocks);
                            $.unblockUI();
                        }
                    })
                });

                completed++;
            });
        })
    } else {
        $('#myModal').modal({
            backdrop: "static",
            keyboard: false,
            show: true
        });
    }
}

function deleteSelected() {
    $('.fancy-checkbox input').each(function() {
        var input = $(this);
        if (input.is(":checked")) {
            var userId = firebase.auth().currentUser.uid;
            var imageKey = input.prop("name");
            firebase.database().ref("usernames").child(userId).child("mylibrary").child(imageKey).remove();
            console.log("removed from library");
            input.parent().parent().remove();
        }
    });
}