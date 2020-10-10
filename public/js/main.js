let saleData = new Array();
let page = 1;
const perPage = 10;

//Lodash template
let saleTableTemplate = _.template(`
  <% _.forEach(sales, function(sale) { %>
    <tr data-id=<%- sale._id %>>
      <td><%- sale.customer.email %></td>
      <td><%- sale.storeLocation %></td>
      <td><%- sale.items.length %></td>
      <td><%- moment.utc(sale.saleDate).format('LLLL') %></td>
    </tr>
  <% }); %>
`);
  
let saleModalBodyTemplate = _.template(`
  <h4>Customer</h4>
  <strong>email:</strong> <%- customer.email %><br />
  <strong>age:</strong> <%- customer.age %><br />
  <strong>satisfaction:</strong> <%- customer.satisfaction %> / 5 
  <br /><br />
  <h4>Items: $<%- total.toFixed(2) %></h4>
  <table class="table">
    <thead>
      <tr>
        <th>Product Name</th>
        <th>Quantity</th>
        <th>Price</th>
      </tr>
    </thead>
    <tbody>
      <% _.forEach(items, function(item) { %>
        <tr>
          <td><%- item.name %></td>
          <td><%- item.quantity %></td>
          <td>$<%- item.price %></td>
        </tr>
      <% }); %>
    </tbody>
  </table>
`);


function loadSaleData() {
  fetch(`/api/sales?page=${page}&perPage=${perPage}`)
    .then(response => response.json())
    .then(json => {
      saleData = json.message;
      let data = saleTableTemplate({ sales: saleData });

      $("#sale-table tbody").html(data);
      $("#current-page").html(page);
    });
};


$(function() {
    let clickedId = "";
    loadSaleData();
    $("#sale-table tbody").on("click", "tr", function() {
      clickedId = $(this).attr("data-id");
      let clickedSale = saleData.find(sale => sale._id === clickedId);
      let total = clickedSale.items.reduce(
        (sum, item) =>
          sum += item.price * item.quantity,
          0
      );
      let saleModalData = { ...clickedSale, total };
      $("#sale-modal .modal-title").html(`Sale: ${clickedId}`);
      $("#sale-modal .modal-body").html(saleModalBodyTemplate(saleModalData));
      $("#sale-modal").modal({
        show: true, 
        backdrop: "static", 
        keyboard: false
      });
    });
  
    $("#previous-page").on("click", function(e) {
      if (page > 1) {
        page = page - 1;
        loadSaleData();
      }
    });
  
    $("#next-page").on("click", function(e) {
      page = page + 1;
      loadSaleData();
    });
});