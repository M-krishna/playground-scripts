module full_subtractor_tb;
    reg a, b, Bin;
    wire D, Bout;

    Full_subtractor fs(
        .a(a),
        .b(b),
        .Bin(Bin),
        .D(D),
        .Bout(Bout)
    );

    initial begin
        #0 a = 0; b = 0; Bin = 0;
        #1 a = 0; b = 0; Bin = 1;
        #1 a = 0; b = 1; Bin = 0;
        #1 a = 0; b = 1; Bin = 1;
        #1 a = 1; b = 0; Bin = 0;
        #1 a = 1; b = 0; Bin = 1;
        #1 a = 1; b = 1; Bin = 0;
        #1 a = 1; b = 1; Bin = 1;
        #1 $finish;
    end

    initial begin
        $monitor("[Time=%0t] a=%0b b=%0b Bin=%0b D=%0b Bout=%0b", $time, a, b, Bin, D, Bout);
    end
endmodule