lbiApp.controller('mySet.shopCtrl', [
    '$scope',
    'lbiService',
    '$upload',
    'userStatus',
    'SweetAlert',
    '$state',
    function($scope, lbiService, $upload, userStatus, SweetAlert,$state) {
        //上传过程中 文件状态和文件名会被擦写覆盖 如果上传失败 回退到原来的状态
        var originStatus, originFilename,fileid,userId;
        
        // 获取用户ID 
        userStatus.then(function(user){
            userId=user.memberId;
        });


        //判断用户上传状态 未上传(unstart)——crossing(上传中)——上传成功解析中(ing)——解析失败/成功(complete)
        $scope.uploadStatus = 'unstart';
        //获取用户当前上传状态
        lbiService('getFiles', 'POST').then(function(info) {
            switch (info[0].isfinish) {
                case 0:
                    $scope.uploadStatus = 'unstart';
                    break;
                case -1:
                    $scope.fileName = info[0].title;
                    $scope.uploadStatus = 'ing';
                    break;
                    //匹配完成
                case 1:

                    $scope.total = info[0].total;
                    $scope.count = info[0].count;
                    $scope.percent = (100 * $scope.count / $scope.total).toFixed(0);
                    $scope.fileName = info[0].title;
                    $scope.uploadStatus = 'complete';

                    //上传文件ID
                    fileid = info[0].id;
                    break;
                default:
                    break;
            }
        });


        $scope.uploadFile=function($files){
            $scope.upload($files);
        }

        //执行文件上传
        $scope.upload = function(files) {
            //文件格式校验
            var file = files[0];

            if (file.name.indexOf('.csv') == '-1') {
                uploadFailed('文件格式错误');
                return false;
            }

            //保存原文件上传状态和文件名
            originStatus = $scope.uploadStatus;
            originFilename = $scope.fileName;

            //修改文件上传状态为上传中
            $scope.uploadStatus = 'crossing';
            $scope.progress = 0;
            $upload.upload({
                url: '/lbi/brand/upload',
                fields: {
                    memberId: userId
                },
                fileFormDataName: 'userfile',
                file: files[0]

                // 上传进度
            }).progress(function(e) {
                $scope.progress = e.loaded / e.total;
            }).success(function(res) {

                // 上传失败
                if (!res.success) {
                    uploadFailed();
                    return false;
                }
                //修改页面状态
                $scope.fileName = files[0].name;
                $scope.uploadStatus = 'ing';
            });
        };

        //上传失败提示
        var uploadFailed = function(tip) {
            SweetAlert.swal({
                title: '上传失败!',
                text: '失败原因:' + tip,
                confirmButtonColor: '#399eee',
                confirmButtonText: '确定'
            }, function(confirm) {
                $scope.uploadStatus = originStatus;
                $scope.fileName = originFilename;
            });
        };

    }
]);
