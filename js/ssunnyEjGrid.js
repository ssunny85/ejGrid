(function ($) {
    /**
     *
     * @class ssunnyGrid
     *
     */
    $.fn.ssunnyEjGrid = function (options) {

        this.opt = $.extend({
            searchBox: null,
            rowsBox: null,
            grid: null,
            gridPage: null,
            page: null,
            pager: null,
            data: null,
            gridId: null,
            postData: null,
            //keyName: null,
            //isRsizeTime: false,
            //isRowspan: false,
            //trNum: 0
        }, options);

        /*
         * ejGrid 초기화
         */
        this.init = function () {
            /*
             * 기본 옵션 설정
             */
            var _this = this;
            this.ejGridOption = {
                dataUrl: '',
                textWrapSettings: {wrapMode: "both"},
                commonWidth: 100,
                columns: [],
                tempId: "ifvGridOriginTemplete",
                rowNum: 10,
                rowList: [10, 20, 30],
                emptyMsg: ifv.commonMessage.noData,
                total: ifv.commonMessage.total + ' : {total}' + ifv.commonMessage.gun,
                dataBound: function (args) {
                    var _thisId = this._id;
                    $('#' + _thisId + ' .e-gridheader').on('click', '.e-headercelldiv', function (args) {
                        var headerText = args.target.innerHTML,
                            gridObj = $('#' + _thisId).ejGrid('instance'),
                            length = gridObj.model.columns.length, columnData;

                        for (var i = 0; i < length; i++) {
                            if (gridObj.model.columns[i]['headerText'] == headerText) {
                                columnData = gridObj.getColumnByIndex(i);
                                _this.sortingData(columnData);
                            }
                        }
                    });
                },
                isResponsive: true,
                allowResizing: true,
                enableTouch: true,
                allowTextWrap: true,
                radio: false,
                allowSorting: false,
                gridDataInit: true,
                recordClick: function () {
                    alert('recordClick');
                },
                recordDoubleClick: function () {
                    alert('recordDoubleClick');
                }
            };

            $.extend(this.ejGridOption, options.ejGridOption);
            this.setPostData();
            this.optionSetting();
            this.uiSetting();
            this.makeGrid();
            this.rowBoxInit();
            this.searchBoxInit();
            if (this.ejGridOption.gridDataInit) this.setAjax();

            if (this.ejGridOption.dataUrl === null || this.ejGridOption.gridDataInit === false) {
                this.emptyMsgDiv.show();
            }
        };

        /*
         * ui 탬플릿 읽어들여서 컴퍼넌트 태그로 변환
         */
        this.uiSetting = function () {
            var con = $("#" + this.ejGridOption.tempId).html();
            this.gridId = "gridId" + this.attr('id');

            con = con.replace('{searchBox}', '<div class="search_box" gridId="searchBox" ></div>');
            con = con.replace('{rowsBox}', '<input class="combo_num_box" gridId="rowsBox" />');
            con = con.replace('{grid}', '<table gridId="grid" id="' + this.gridId + '"></table>');
            con = con.replace('{gridPage}', '<div gridId="gridPage" id="gridPage" ></div>');
            con = con.replace('{page}', '<div gridId="page" ></div>');
            con = con.replace('{total}', '<div gridId="total" ></div>');
            con = con.replace('{btnAdd}', '<input type="button" class="btnAdd" gridId="btnAdd" value="등록"/>');
            con = con.replace('{btnDelete}', '<input type="button" class="btnDelete" gridId="btnDelete" value="삭제"/>');
            con = con.replace('{title}', '<div gridId="title" class="title"/>');
            con = con.replace('{excelDown}', '<button gridId="excelDown" class="btn btn-sm btn-imgonly"><i class="fa fa-search"></i></button>');

            this.html(con);
            this.opt.searchBox = this.find("[gridId=searchBox]");
            this.opt.rowsBox = this.find("[gridId=rowsBox]");
            this.opt.gridPage = this.find("[gridId=gridPage]");
            this.opt.page = this.find("[gridId=page]");
            this.opt.total = this.find("[gridId=total]");
            this.opt.btnAdd = this.find("[gridId=btnAdd]");
            this.opt.btnDelete = this.find("[gridId=btnDelete]");
            this.opt.title = this.find("[gridId=title]");
            this.opt.excelDown = this.find("[gridId=excelDown]");
        };

        /*
         * 데이타없을때 나오는 영역
         */
        this.makeEmptyDiv = function () {
            this.emptyMsgDiv = $('<div class="empty_msg"></div>');
            this.emptyMsgDiv.text(this.ejGridOption.emptyMsg);
        };

        /*
         * ajax통신 시 requestData 생성
         */
        this.setPostData = function () {
            var postData = {
                searchWord: '',
                searchText: '',
                page: 1,
                appServiceId: window.appServiceId,
                country: window.country,
                lang: window.lang
            };
            if (this.ejGridOption.requestGridData) {
                $.extend(postData, this.ejGridOption.requestGridData);
            }
            this.opt.postData = postData;
        };

        /*
         * ajax통신
         */
        this.setAjax = function () {
            var _this = this;
            $.ajax({
                url: this.ejGridOption.dataUrl,
                dataType: 'json',
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify(this.opt.postData),
                beforeSend: function () {
                    //$('body').append($('<div>').addClass('loading').text(MESSAGE.common.progressTxt || '조회중'));
                },
                success: function (resultData) {
                    if (resultData.records > 0) {
                        _this.opt.gridControl.dataSource(resultData.rows);
                        //_this.pageInit();
                        _this.pagerSetting(resultData);
                        _this.totalSetting(resultData);
                        _this.emptyMsgDiv.hide();
                    } else {
                        _this.emptyMsgDiv.show();
                    }
                },
                error: function (xhr, status, error) {
                    console.log(error);
                    _this.emptyMsgDiv.show();
                },
                complete: function () {
                    $('.loading').remove();
                    _this.opt.grid.find('.e-headercell .e-headercelldiv').addClass('sort_type');
                    for (var i = 0; i < _this.ejGridOption.columns.length; i++) {
                        if (_this.ejGridOption.columns[i].customAttributes.index === _this.opt.postData.index) {
                            _this.opt.grid.find('.e-headercell[title="' + _this.ejGridOption.columns[i]['headerText'] + '"] .e-headercelldiv').addClass(_this.opt.postData.sord)
                        }
                    }
                }
            });
        };

        /*
         * header sorting
         */
        this.sortingData = function (cItem) {
            if (cItem.customAttributes.sortable === false) {
                this.opt.grid.find('.e-headercell[title="' + cItem.headerText + '"] .e-headercelldiv').css({cursor: 'default'});
                return;
            }
            this.opt.postData.index = cItem.customAttributes.index;

            if (this.opt.postData.sord === 'desc') {
                this.opt.postData.sord = 'asc';
            } else {
                this.opt.postData.sord = 'desc';
            }
            console.log('sortingData');
            console.log(this.opt.postData);
            this.setAjax();
        }

        /*
         * ejGrid 생성
         */
        this.makeGrid = function () {
            this.makeEmptyDiv();
            this.ejGridOption.gridId = this.attr('id');
            this.opt.grid = this.find("[gridId=grid]").ejGrid(this.ejGridOption);
            this.opt.gridControl = this.opt.grid.data('ejGrid');
            this.emptyMsgDiv.appendTo(this.opt.grid);
        };

        this.optionSetting = function () {
            var _this = this;

            if (this.ejGridOption.radio === true) {
                this.setRadio();
            }
        };

        /*
         * radio 셋팅
         */
        this.setRadio = function () {
            var _this = this;

            var radioColumn = {
                headerText: '선택',
                template: '<input type="radio" name="radio_' + _this.gridId + '" />',
                width: 40,
                headerTextAlign: 'center',
                textAlign: 'center',
                allowSorting: false
            };
            this.ejGridOption.columns.unshift(radioColumn);
            this.ejGridOption.rowSelecting = function (args) {
                var $radio = $('input[name=radio_' + _this.gridId).eq(args.rowIndex);
                $radio.prop('checked', true);
            };
        };

        /*
         *	row 셀렉트 박스 초기화
         */
        this.rowBoxInit = function () {
            if (this.opt.rowsBox == null) return;

            var arr = [];
            for (var i = 0; i < this.ejGridOption.rowList.length; i++) {
                var obj = {key: this.ejGridOption.rowList[i], value: this.ejGridOption.rowList[i],};
                if (i == 0) obj.selected = true;
                arr.push(obj);
            }

            var selectbox = this.opt.rowsBox.ifvSelectBox();
            var _this = this;
            selectbox.setData(arr, function (obj) {
                _this.pageInit();
                _this.opt.postData.rowNum = obj.key;
                _this.opt.postData.rows = _this.ejGridOption.rowNum;
                _this.setAjax();
            });
        };

        /*
         *	검색 박스 초기화
         */
        this.searchBoxInit = function () {
            if (this.opt.searchBox == null) return;

            var headArr = [];
            var count = 0;
            for (var i = 0; i < this.ejGridOption.columns.length; i++) {
                if (this.ejGridOption.columns[i].visible != false && (this.ejGridOption.columns[i].customAttributes.searchable == null || this.ejGridOption.columns[i].customAttributes.searchable == true)) {
                    headArr.push({
                        value: this.ejGridOption.columns[count].headerText,
                        key: this.ejGridOption.columns[i].customAttributes.index
                    }); //colModel은 hidden이 있으므로 count로 indexing
                }
                if (this.ejGridOption.columns[i].visible != false) {
                    count++;
                }
            }

            var _this = this;
            var searchBox = this.opt.searchBox.ifvSearchBox();
            searchBox.setData(headArr, function (searchObj) {
                //검색시에는 토탈 갯수 바뀌므로 페이지다시 만듬 page도 1로
                _this.pageInit();
                $.extend(_this.opt.postData, searchObj);
                _this.setAjax();
            });
        };

        /*
         * 페이지 초기화
         */
        this.pageInit = function () {
            if (this.opt.pager != null) {
                this.opt.pager.empty();
                this.opt.pager = null;
                this.opt.postData.page = 1;
            }
        };

        /*
         * 페이지 셋팅 및 변환
         */
        this.pagerSetting = function (data) {
            if (this.opt.pager == null) {
                var _this = this;
                this.opt.pager = this.opt.page.ifvSimplePager({
                    dataObj: {rows: _this.ejGridOption.rowNum},
                    callback: function (page) {
                        _this.opt.postData.page = page;
                        _this.setAjax();
                    }
                });
                this.opt.pager.change(data);
            }
        };

        /*
         * 토탈 셋팅
         */
        this.totalSetting = function (data) {
            if (data.records == null) return;
            var txt = this.ejGridOption.total.replace('{total}', data.records);
            this.opt.total.text(txt);
        };

        this.init();
        return this;
    }
})(jQuery);