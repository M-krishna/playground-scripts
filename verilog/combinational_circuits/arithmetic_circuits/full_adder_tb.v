module full_adder_tb;
    reg a, b, cin;
    wire sum, cout;

    Full_adder fa(
        .a(a),
        .b(b),
        .cin(cin),
        .sum(sum),
        .cout(cout)
    );

    initial begin
        #0 a = 0; b = 0; cin = 0;
        #1 a = 0; b = 0; cin = 1;
        #1 a = 0; b = 1; cin = 0;
        #1 a = 0; b = 1; cin = 1;
        #1 a = 1; b = 0; cin = 0;
        #1 a = 1; b = 0; cin = 1;
        #1 a = 1; b = 1; cin = 0;
        #1 a = 1; b = 1; cin = 1;
        #1 $finish;
    end

    initial begin
        $monitor("[Time=%0t] a=%0b b=%0b cin=%0b sum=%0b cout=%0b", $time, a, b, cin, sum, cout);
    end
endmodule