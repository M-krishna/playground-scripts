module _Nand(
    input a, b,
    output wire out
);
    assign out = ~(a & b);
endmodule