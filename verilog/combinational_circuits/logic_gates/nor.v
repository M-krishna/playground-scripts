module _Nor(
    input a, b,
    output out
);
    wire or_out;
    _Or o(a, b, or_out);
    _Not n(or_out, out);
endmodule