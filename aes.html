import java.util.Scanner;

public class AffineCipher {

    // Check if 'a' and 26 are coprime (gcd must be 1)
    static int gcd(int a, int b) {
        return b == 0 ? a : gcd(b, a % b);
    }

    // Find modular multiplicative inverse of 'a' mod 26
    static int modInverse(int a) {
        for (int x = 1; x < 26; x++) {
            if ((a * x) % 26 == 1) return x;
        }
        return -1; // No inverse found
    }

    // Encrypt: E(x) = (a * x + b) % 26
    static String encrypt(String str, int a, int b) {
        StringBuilder cipher = new StringBuilder();
        for (char c : str.toCharArray()) {
            if (Character.isLetter(c)) {
                int x = Character.toUpperCase(c) - 'A';
                cipher.append((char) (((a * x + b) % 26) + 'A'));
            } else {
                cipher.append(c); // Keep spaces/symbols as-is
            }
        }
        return cipher.toString();
    }

    // Decrypt: D(x) = a_inv * (x - b + 26) % 26
    static String decrypt(String cipher, int a, int b) {
        StringBuilder original = new StringBuilder();
        int aInv = modInverse(a);
        for (char c : cipher.toCharArray()) {
            if (Character.isLetter(c)) {
                int x = Character.toUpperCase(c) - 'A';
                original.append((char) ((aInv * (x - b + 26) % 26) + 'A'));
            } else {
                original.append(c); // Keep spaces/symbols as-is
            }
        }
        return original.toString();
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.print("Enter the text : ");
        String str = sc.nextLine().toUpperCase();

        System.out.print("Enter key 'a'  : ");
        int a = sc.nextInt();

        System.out.print("Enter key 'b'  : ");
        int b = sc.nextInt();

        // Validate 'a' — must be coprime with 26
        if (gcd(a, 26) != 1) {
            System.out.println("\n❌ Invalid key! 'a' must be coprime with 26.");
            System.out.println("Valid values of 'a': 1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25");
            sc.close();
            return;
        }

        String encrypted = encrypt(str, a, b);
        String decrypted = decrypt(encrypted, a, b);

        System.out.println("\nEncrypted : " + encrypted);
        System.out.println("Decrypted : " + decrypted);

        sc.close();
    }
}
```

---

### Sample Output:
```
Enter the text : GEEKS FOR GEEKS
Enter key 'a'  : 7
Enter key 'b'  : 3

Encrypted : ZXXBT AYK ZXXBT
Decrypted : GEEKS FOR GEEKS
```

---

### How Affine Cipher Works:

| Operation | Formula |
|---|---|
| **Encrypt** | `E(x) = (a × x + b) % 26` |
| **Decrypt** | `D(x) = a⁻¹ × (x − b + 26) % 26` |
| **Key** | Two integers `a` and `b` |
| **Constraint** | `gcd(a, 26) = 1` — so decryption is possible |

---

### Valid values of `a` (coprime with 26):
```
1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25
