﻿using System;
using System.Collections.Generic;
using System.Text;

namespace Common.DbContext
{
    public class MyDbContext
    {
        public readonly MySqlConnection _MyConnection = null;
        public readonly MySqlCommand _MyCommand = null;
        public MyDbContext()
        {
            _MyConnection = new MySqlConnection();
            _MyCommand = new MySqlCommand(_MyConnection._MyConnection);
        }

        //public MySqlCommand mdm
        //{
        //    get => _mdm;
        //}
        //public MySqlConnection msc
        //{
        //    get => _msc;
        //}

        public void Close_MyDbContext()
        {
            if (_MyCommand != null)
                _MyCommand.Close();
            if (_MyConnection != null)
                _MyConnection.Close();
        }
    }
}
