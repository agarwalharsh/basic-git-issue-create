$(document).ready(function(){
    var username;

    $(document).on("click", ".getrepo", function(){
        username = $(".username").val();

        if (username.length) {
            fetchRepoList(username);
        }
    });

    $(document).on("click", ".create-issue", function(e){
        $(e.target).closest(".repoDetailWrapper").find(".new-issue-wrap").removeClass("hidden");
    });

    $(document).on("click", ".submit-issue", function(e){
        e.preventDefault();
        var issueWrap = $(e.target).closest(".new-issue-wrap"),
            getTitle = issueWrap.find(".issue-title").val(),
            getComments = issueWrap.find(".issue-comment").val(),
            repoName = issueWrap.data('repoName'),
            repoUrl = 'https://api.github.com/repos/' + username + '/' + repoName + '/issues';

        submitIssueToRepo(getTitle, getComments, repoUrl);
    });


    function fetchRepoList(username) {

        $.ajax({
            type: "GET",
            url: "https://api.github.com/users/"+username+"/repos"
        }).done(function(response){
            $(".repo-list-wrap").removeClass("hidden");
            $(".no-user").addClass("hidden");
            $(".repo-list").html("");
            for (i=0; i<response.length; i++) {
                $(".repo-list").append(`
                    <div class="repoDetailWrapper">
                        <div class="repoDetail">
                            <span class="repoName">${response[i].name}</span>
                            <button type="button" class="create-issue btn btn-success">Create Issue</button>
                        </div>
                        <div class="new-issue-wrap hidden" data-repo-name=${response[i].name}>
                            <div class="col-md-5">
                                <div class="col-md-12">
                                    <label>Title</label>
                                    <input type="text" class="issue-title form-control" placeholder="Enter Issue Title">
                                </div>
                                <div class="col-md-12">
                                    <label>Comments</label>
                                    <textarea class="form-control issue-comment" placeholder="Enter your comment"></textarea>
                                </div>
                                <button type="submit" class="submit-issue btn btn-success">Submit</button>
                            </div>
                        </div>
                    </div>
                `);
            }
        }).fail(function() {
            $(".no-user").removeClass("hidden");
            $(".repo-list-wrap").addClass("hidden");
        })
    }

    function submitIssueToRepo(getTitle, getComments, repoUrl) {
        $.ajax ({
            type: 'POST',
            url: repoUrl,
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "token 32106413bb97dc2205e72dbd8889872195412a4b");
            },
            data: JSON.stringify({
                title: getTitle,
                body: getComments,
                assignees: [
                    "agarwalharsh"
                ],
                milestone: 1,
                labels: [
                    "bug"
                ]
            })
        }).done(function(data) {
            alert("Your issue has been logged!");
        }).fail(function(err) {
            alert("There is some issue in logging your issue. We are working on it");
        });
    }
});