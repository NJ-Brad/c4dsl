public override string ToString()
        {
            StringBuilder sb = new StringBuilder();

            if (Command.StartsWith("Rel"))
            {
                sb.Append("Rel(");
                sb.Append(Parameters[0]);

                if (Parameters.Count > 1)
                {
                    sb.Append($", {Parameters[1]}");
                }

                if (Parameters.Count > 2)
                {
                    sb.Append($", {Parameters[2]}");
                }
                if (Parameters.Count > 3)
                {
                    sb.Append($", {Parameters[3]}");
                }

                sb.Append(")");
            }
            else
            {
                sb.Append(Command);
                if (IsDatabase)
                {
                    sb.Append("Db");
                }
                if (IsExternal)
                {
                    sb.Append("_Ext");
                }

                sb.Append("(");

                sb.Append(Parameters[0]);

                if (Parameters.Count > 1)
                {
                    sb.Append($", {Parameters[1]}");
                }

                if (Parameters.Count > 2)
                {
                    sb.Append($", {Parameters[2]}");
                }
                if (Parameters.Count > 3)
                {
                    sb.Append($", {Parameters[3]}");
                }

                sb.Append(")");
            }

            return sb.ToString();
        }

        public int Level { get; set; }
        public string Text { get; set; } = "";
        public string Command { get; set; } = "";
        public bool IsDatabase { get; set; }
        public bool IsExternal { get; set; }

        public List<string> Parameters { get; set; } = new List<string>();

        public string GetValue(int parameterNumber)
        {
            string rtnVal = string.Empty;

            if (Parameters.Count > parameterNumber)
            {
                rtnVal = Parameters[parameterNumber].Trim('\"').Replace("</size>\\n<size:$TECHN_FONT_SIZE>", "\r\n");
            }

            return rtnVal;
        }
        public void SetValue(int parameterNumber, string value, bool quote = true)
        {
            string newValue = value;

            if (quote)
            {
                newValue = value.Replace("\r\n", "</size>\\n<size:$TECHN_FONT_SIZE>");
                newValue = "\"" + newValue + "\"";
            }

            if (Parameters.Count > parameterNumber)
            {
                Parameters[parameterNumber] = newValue;
            }
            else
            {
                Parameters.Add(newValue);
            }

            if((string.IsNullOrEmpty(newValue)) && (Parameters.Count == (parameterNumber -1)))
            {
                Parameters.RemoveAt(parameterNumber - 1);
            }
        }