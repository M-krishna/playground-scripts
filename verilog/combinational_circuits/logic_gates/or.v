module _Or(
    input a, b,
    output out
);
    wire nand_out1, nand_out2;
    _Nand n1(a, a, nand_out1);
    _Nand n2(b, b, nand_out2);
    _Nand n3(nand_out1, nand_out2, out);
endmodule