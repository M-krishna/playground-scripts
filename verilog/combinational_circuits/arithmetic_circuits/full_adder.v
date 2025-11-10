module Full_adder(
    input a, b, cin,    // cin = carry in
    output sum, cout    // cout = carry out
);
    // first half adder
    wire sum1, carry1;
    Half_adder ha1(a, b, sum1, carry1);

    // second half adder
    wire carry2;
    Half_adder ha2(sum1, cin, sum, carry2);

    // carry1 OR carry2
    _Or o(carry1, carry2, cout);
endmodule