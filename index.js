$(function () {
    const drawer = $('#maybs_drawer').dxDrawer({
        opened: true,
        height: "100%",
        elementAttr: {
            class: "mr-1"
        },
        closeOnOutsideClick: false,
        template() {
            const $list = $('<div class="shadow">').height('100%').width(200).addClass('maybs_panel-list');
            return $list.dxList({
                dataSource: [
                    { id: 1, text: 'Products', icon: 'product' },
                    { id: 2, text: 'Sales', icon: 'money' },
                    { id: 3, text: 'Customers', icon: 'group' },
                    { id: 4, text: 'Employees', icon: 'card' },
                    { id: 5, text: 'Reports', icon: 'chart' },
                ],
            });
        },
    }).dxDrawer('instance');

    $('#maybs_toolbar').dxToolbar({
        items: [{
            widget: 'dxButton',
            location: 'before',
            options: {
                icon: 'menu',
                stylingMode: 'text',
                text: 'DevExtreme JQuery App',
                onClick() {
                    drawer.toggle();
                },
            },
        }],
    });

    //var customStore = new DevExpress.data.CustomStore({
    //    key: "ID",
    //    load: function (loadOptions) {
    //        var d = $.Deferred();

    //        // --- Ganti URL di sini dengan URL API ASP.NET Core Anda ---
    //        //var apiUrl = "http://localhost:5000/api/Data";
    //        var apiUrl = "https://dummyjson.com/products?limit=100&skip=5&select=id,sku,title,category,price,rating,stock,brand";

    //        var params = { /* parameter DevExtreme seperti sebelumnya */ };

    //        $.getJSON(apiUrl, params)
    //            .done(function (data) {
    //                d.resolve(data.data, { totalCount: data.totalCount });
    //            })
    //            .fail(function (error) {
    //                console.error("Kesalahan saat mengambil data:", error);
    //                d.reject("Gagal memuat data dari API.");
    //            });
    //        return d.promise();
    //    }
    //});

    //$("#dataGridContainer").dxDataGrid({
    //    dataSource: customStore,
    //    remoteOperations: true,
    //});

    var products_store = new DevExpress.data.CustomStore({
        key: "id",
        load: function (loadOptions) {
            var d = $.Deferred();
            var apiUrl = "https://dummyjson.com/products?limit=25&skip=&select=id,sku,title,category,price,rating,stock,minimumOrderQuantity,brand";
            var params = { /* parameter DevExtreme seperti sebelumnya */ };

            //$.getJSON(apiUrl, params)
            $.getJSON(apiUrl)
                .done(function (response) {
                    d.resolve(response.products, {
                        totalCount: response.total
                    });
                })
                .fail(function () {
                    d.reject("Gagal memuat data produk.");
                });

            return d.promise();
        }
    });
    $("#maybs_home_datagrid").dxDataGrid({
        //dataSource: {
        //    store: {
        //        type: "odata",
        //        url: "https://dummyjson.com/products?limit=100&skip=&select=id,sku,title,category,price,rating,stock,brand",
        //        key: "id,sku"
        //    }        },
        dataSource: products_store,
        focusedRowEnabled: true,
        hoverStateEnabled: true,
        allowColumnReordering: true,
        rowAlternationEnabled: true,
        showBorders: true,
        showColumnLines: true,
        showRowLines: true,
        height: '100%',
        width: '100%',
        remoteOperations: false,
        verticalScrollBarMode: 'on',
        scrolling: {
            mode: 'on'
        },
        filterRow: {
            visible: true,
            applyFilter: 'auto',
        },
        headerFilter: {
            visible: true,
        },
        paging: {
            pageSize: 15,
        },
        pager: {
            visible: true,
            showPageSizeSelector: true,
            showInfo: true,
            showNavigationButtons: true,
            allowedPageSizes: [10, 15, 20, 25, 50, 100],
        },
        searchPanel: {
            visible: false,
            highlightCaseSensitive: true,
        },
        elementAttr: {
            class: "center-header-text"
        },
        grouping: {
            contextMenuEnabled: true,
            autoExpandAll: true,
        },
        groupPanel: {
            visible: true,
            allowColumnDragging: true,
        },
        onCellPrepared: function (e) {
            if (e.rowType == "header") {
                e.cellElement.css("text-align", "center");
            }
        },
        columns: [
            {
                dataField: "id",
                caption: "ID",
                dataType: "number",
                selectedFilterOperation: "=",
                allowGrouping: false,
                format: {
                    type: "fixedPoint",
                    precision: 0,
                },
            },
            {
                dataField: "sku",
                caption: "SKU",
                dataType: "string",
                selectedFilterOperation: "contains",
                allowGrouping: true,
            },
            {
                dataField: "title",
                caption: "TITLE",
                dataType: "string",
                selectedFilterOperation: "contains",
                allowGrouping: true,
            },
            {
                dataField: "category",
                caption: "CATEGORY",
                dataType: "string",
                selectedFilterOperation: "contains",
                allowGrouping: true,
                groupIndex: 0,
            },
            {
                dataField: "price",
                caption: "PRICE",
                dataType: "number",
                selectedFilterOperation: "between",
                allowGrouping: true,
                format: {
                    type: "fixedPoint",
                    precision: 2,
                },
            },
            {
                dataField: "rating",
                caption: "RATING",
                dataType: "number",
                selectedFilterOperation: "between",
                allowGrouping: true,
                format: {
                    type: "fixedPoint",
                    precision: 2,
                },
            },
            {
                dataField: "stock",
                caption: "STOCK",
                dataType: "number",
                selectedFilterOperation: "between",
                allowGrouping: true,
                format: {
                    type: "fixedPoint",
                    precision: 0,
                },
                cellTemplate: function (container, options) {
                    const stc_value = options.value;
                    const min_value = options.data.minimumOrderQuantity;

                    let badge_cls = 'badge-info';
                    let badge_txt = 'OK';
                    if (stc_value < (3 * min_value)) {
                        badge_cls = 'badge-danger';
                        badge_txt = 'CRITICAL';
                    } else if (stc_value <= (5 * min_value)) {
                        badge_cls = 'badge-warning';
                        badge_txt = 'LIMIT';
                    }

                    const html = `<div class="d-flex justify-content-between align-items-center">
                        <span class="badge ${badge_cls}">${badge_txt}</span>
                        <span>${stc_value}</span>
                      </div>`;

                    container.html(html);
                }
            },
            {
                dataField: "minimumOrderQuantity",
                caption: "MIN ORDER",
                dataType: "number",
                selectedFilterOperation: "=",
                allowGrouping: true,
                format: {
                    type: "fixedPoint",
                    precision: 0,
                },
            },
            {
                dataField: "brand",
                caption: "BRAND",
                dataType: "string",
                selectedFilterOperation: "contains",
                allowGrouping: true,
            },
        ],
    });
});